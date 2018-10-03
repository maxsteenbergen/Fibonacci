# This program finds the nth fibonacci number

# Uses python3

import sys

def calc_fib(n):
	fib_list = list(range(0,n+1))
	for i in range(2,n+1):
		fib_list[i] = fib_list[i-1] + fib_list[i-2]
	return fib_list[n]


a = int(input())
print(calc_fib(a))
