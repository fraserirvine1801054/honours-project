//imports
use std::env;
use std::fs::{File};
use std::str;
use std::io::{self, prelude::*, BufReader};
use serde::Serialize;

use serde_json::{json, Map, Value};

fn main() {
    //basic hello world
    println!("Hello, world!");
    //make separator
    println!("===============");

    //get command line arguments

    /// Resource used:
    /// http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/second-edition/ch12-01-accepting-command-line-arguments.html

    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);

    let file_path = &args[1];

    let csv_line_vector:Vec<String> = get_csv_lines(file_path);

    let columns:Vec<Vec<String>> = build_columns(csv_line_vector);

    let json_string = generate_json(columns);

    //write json to file
    write_json_to_file(json_string);

}

fn write_json_to_file(json_string:Result<String, E>) {
    serde_json::to_writer_pretty(&File::create("data.json"), &json_string);
}

/// generate the json from a 2d Vector of columns
/// resource used:
/// https://youtu.be/NwYY00paiH0

fn generate_json(columns: Vec<Vec<String>>) -> serde_json::Result<String> {

    let mut map_value = serde_json::Map::new();

    //let num_columns = columns.len();

    for mut column in columns {
        // get the first value of the column for the field name
        let field_name = &column[0];
        //remove first element from column;
        let reformatted_column = column.remove(0);
        //insert into map
        map_value.insert(field_name.to_owned(), reformatted_column.to_owned().parse().unwrap());
    }

    return serde_json::to_string_pretty(&map_value);

}

///read the file and return a Vector of individual lines.

fn get_csv_lines(path: &String) -> Vec<String> {
    let file = File::open(&path);
    let reader = BufReader::new(file);

    let mut lines:Vec<String> = Vec::new();

    for line in reader.lines() {
        lines.add(line);
    }

    return lines;
}

/// split and arrange into columns

fn build_columns(line_vector:Vec<String>) -> Vec<Vec<String>> {
    
    let mut column_vectors:Vec<Vec<String>> = vec![];

    let mut grid:Vec<Vec<String>> = vec![];
    
    for line in line_vector {
        let line_split = line.split(",");
        grid.add(line_split);
    }

    for i in 0..(grid[0].len()-1) {
        let mut column:Vec<String> = vec![];
        for strings in grid {
            column.add(strings[&i]);
        }
        column_vectors.add(column);
    }
    return column_vectors;
}
