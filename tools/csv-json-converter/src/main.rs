//imports
use std::{env, fs};
use std::fs::{File};
use std::str;
use std::io::{prelude::*, BufReader};
use serde::{Serialize, Deserialize};

//use serde_json::{json, Map, Value};

//make structs

#[derive (Serialize, Deserialize)]
struct DataSet {
    data: Vec<Column>
}

#[derive (Serialize, Deserialize)]
struct Column {
    field_name: String,
    values: Vec<String>
}

fn main() {
    //basic hello world
    println!("Hello, world!");
    //make separator
    println!("===============");

    //print description
    println!("This tool is made to convert CSV files into JSON files.");
    println!("This tool is not designed to interact with the web app");


    //get command line arguments

    // Resource used:
    // http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/second-edition/ch12-01-accepting-command-line-arguments.html

    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);

    // args[1] the file name
    // args[2] the destination path (must incude file extension)

    let file_path = &args[1];
    let destination_path = &args[2];

    let csv_line_vector:Vec<String> = get_csv_lines(file_path);

    let columns:Vec<Vec<String>> = build_columns(csv_line_vector);

    let json_string = generate_json(columns);

    //write json to file
    write_json_to_file(json_string, destination_path.to_owned());

}

fn write_json_to_file(json_string:String, destination:String) {
    fs::write(destination, json_string).expect("Unable to write file or file extension is not specified");
}

// generate the json from a 2d Vector of columns
// resource used:
// https://youtu.be/NwYY00paiH0

fn generate_json(columns: Vec<Vec<String>>) -> String {

    let mut formatted_columns = vec![];

    for mut column in columns {
        //get the field name in the column
        let field_name = column[0].to_owned();
        //remove field name from column.
        column.remove(0);

        let _column = Column {
            field_name: field_name.to_owned(),
            values: column
        };
        formatted_columns.push(_column);
    }

    let data_set = DataSet {
        data: formatted_columns
    };


    let json = serde_json::to_string_pretty(&data_set).expect("unable to create json");
    return json;
}

//read the file and return a Vector of individual lines.

fn get_csv_lines(path: &String) -> Vec<String> {
    let file = File::open(&path).expect("unable to open file");
    let reader = BufReader::new(file);

    let mut line_vec:Vec<String> = vec![];

    for line in reader.lines() {
        let line_str = line.expect("couldn't read line");
        line_vec.push(line_str);
    }

    return line_vec;
}

// split and arrange into columns

fn build_columns(line_vector:Vec<String>) -> Vec<Vec<String>> {
    
    let mut column_vectors:Vec<Vec<String>> = vec![];

    let mut grid:Vec<Vec<String>> = vec![];
    
    for line in line_vector {
        let mut strings:Vec<String> = vec![];
        let line_split = line.split(",");

        for _string in line_split {
            println!("found string: {}",_string);
            strings.push(_string.parse().unwrap());
        }

        grid.push(strings);
    }

    let column_count = grid[0].len();

    for i in 0..column_count {
        
        let mut column:Vec<String> = vec![];
        for strings in &grid {

            column.push(strings[i].to_owned());

        }
        column_vectors.push(column);
    }
    return column_vectors;
}
