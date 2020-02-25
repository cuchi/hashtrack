package term

import (
	"fmt"
	"strings"
)

func Bold(str string) string {
	return fmt.Sprintf("\u001b[1m%s\u001b[0m", str)
}

func Cyan(str string) string {
	return fmt.Sprintf("\u001b[36;1m%s\u001b[0m", str)
}

func Dimmed(str string) string {
	return fmt.Sprintf("\u001b[30;1m%s\u001b[0m", str)
}

func wrap(chars []rune, columnSize int) []string {
	if len(chars) <= columnSize {
		return []string{string(chars)}
	}
	breakIndex := 0
	for index, char := range chars {
		if index > columnSize-1 {
			if breakIndex == 0 {
				break
			}
			next := wrap(chars[breakIndex+1:], columnSize)
			current := string(chars[:breakIndex])
			return append([]string{current}, next...)
		}
		if char == ' ' {
			breakIndex = index
		}
	}
	return []string{string(chars)}
}

func Wrap(str string, columnSize int, indentSize int) string {
	splitted := strings.Split(str, "\n")
	wrapped := []string{}
	for _, line := range splitted {
		chars := []rune(line)
		wrapped = append(wrapped, wrap(chars, columnSize)...)
	}

	for index, line := range wrapped {
		wrapped[index] = strings.Repeat(" ", indentSize) + line
	}
	return strings.Join(wrapped, "\n")
}
