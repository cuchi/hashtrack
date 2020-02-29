package term

import (
	"fmt"
	"testing"
)

const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et augue turpis. Maecenas laoreet feugiat suscipit. Morbi tempus augue augue, a fringilla tortor dignissim vitae."

const wrappedAt40 = `Lorem ipsum dolor sit amet, consectetur
adipiscing elit. Aliquam et augue
turpis. Maecenas laoreet feugiat
suscipit. Morbi tempus augue augue, a
fringilla tortor dignissim vitae.`

const wrappedAt40WithIndent2 = `  Lorem ipsum dolor sit amet, consectetur
  adipiscing elit. Aliquam et augue
  turpis. Maecenas laoreet feugiat
  suscipit. Morbi tempus augue augue, a
  fringilla tortor dignissim vitae.`

const shortText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

const shortWrappedAt1 = `Lorem
ipsum
dolor
sit
amet,
consectetur
adipiscing
elit.`

func showDiff(expected string, got string) string {
	return fmt.Sprintf("\n### EXPECTED ###\n%s\n### GOT ###\n%s\n", expected, got)
}

func TestWrapWith40Columns(t *testing.T) {
	wrapped := Wrap(longText, 40, 0)
	if wrapped != wrappedAt40 {
		t.Error(showDiff(wrappedAt40, wrapped))
	}
}

func TestWrapWith40ColumnsIndent2(t *testing.T) {
	wrapped := Wrap(longText, 40, 2)
	if wrapped != wrappedAt40WithIndent2 {
		t.Error(showDiff(wrappedAt40WithIndent2, wrapped))
	}
}

func TestWrapWith1Column(t *testing.T) {
	wrapped := Wrap(shortText, 1, 0)
	if wrapped != shortWrappedAt1 {
		t.Error(showDiff(shortWrappedAt1, wrapped))
	}
}

func TestWrapWithLargerColumnSize(t *testing.T) {
	wrapped := Wrap(longText, 10000, 0)
	if wrapped != longText {
		t.Error(showDiff(longText, wrapped))
	}
}
