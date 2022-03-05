//imports
use std::env;
use std::fs::{File};
use std::str;
use std::io::{self, prelude::*, BufReader};

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

fn build_columns(vector:Vec<String>) -> Vec<Vec<String>> {
    
}
