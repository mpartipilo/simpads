# MSG Simulator

The task is to run a simulation of an Air Defense System, as described in the assignment.

## Requirements

A working installation of NodeJS (Tested with v22.8.0).

## Testing

There are some very simple tests covering basic cases. In production environments
these tests would be considerably more exhaustive. For the scope of this assignment,
the tests have been kept simple.

```shell
node test.js
```

## Run

### Console

The console version takes 3 positional parameters:

1. A CSV file with the specified format to be used as input.
2. Optional: A random seed initializer
3. Optional: A custom PoK ratio

```shell
node main.js radar-input.csv 1000 0.8;
```

### Browser

Refer to the project inside the ui directory [MSG Interactive](./ui/README.md).

## Disclaimer

For the scope of this assignment, some boilerplate has been left out, such as
validating input has correct formatting, or filtering of empty entries.
