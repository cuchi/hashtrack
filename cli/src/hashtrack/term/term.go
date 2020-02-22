package term

import "fmt"

func Bold(str string) string {
	return fmt.Sprintf("\u001b[1m%s\u001b[0m", str)
}

func Cyan(str string) string {
	return fmt.Sprintf("\u001b[36;1m%s\u001b[0m", str)
}

func Dimmed(str string) string {
	return fmt.Sprintf("\u001b[30;1m%s\u001b[0m", str)
}
