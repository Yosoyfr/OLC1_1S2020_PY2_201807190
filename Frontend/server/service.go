package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Server levantado")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "<h1>Server en el puerto 4000</h1>")
	})
	http.ListenAndServe(":4000", nil)
}
