/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package main

import "self-healing-demo/cmd"
import "fmt" // unused import

func main() {
	cmd.Execute()
	// Call undefined variable
	undefinedVariable := nonExistentFunction()
	fmt.Print(undefinedVariable) // This won't compile
