package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

func main() {
	card := "1234-5678-9012-3456"
	card = "****-****-****-3456"
	card = uuid.New().String()
	fmt.Println("Hello, World!", card)

	http.ListenAndServe(":8080", nil)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	},
	)

	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	},
	)
}
