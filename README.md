# ICP Python Basic

Welcome to the **ICP Python Basic** project! This repository demonstrates fundamental concepts of Python development within the Internet Computer (ICP) ecosystem. The project serves as an educational resource for those looking to understand the basics of working with Python in a decentralized web environment using ICP.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is intended to showcase basic Python operations on the Internet Computer, providing hands-on examples for new developers entering the ICP ecosystem. This project focuses on fundamental interactions and script setups to introduce Python developers to ICP-based programming.

## Getting Started

To get started with this project, clone the repository and follow the steps in the [Installation](#installation) section below. You'll learn how to set up your environment and execute Python scripts in an ICP-compatible way.

## Prerequisites

Before running the code, ensure that you have the following software installed:

- **Python** (3.8 or later)
- **Dfinity SDK**: Required to deploy on the Internet Computer (follow the [official Dfinity installation guide](https://smartcontracts.org/docs/quickstart/quickstart.html))

## Installation

1. **Clone the repository:**
  ```bash
  git clone https://github.com/jmgomezl/ICP-python-basic.git
  cd ICP-python-basic
  ```

2. **Set up a virtual environment (recommended):**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
3. **stall the necessary dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4. Set up Dfinity SDK for deployment (if deploying to ICP): Follow the instructions in the Dfinity SDK documentation to install and configure the SDK.

**Usage**
Run the following command to execute the main Python script:
    ```bash
    python app.py
    ```

This script provides a basic demonstration of Python's interaction capabilities with the ICP environment, including some elementary functions and operations.
To deploy on ICP, ensure your local network is set up and configured, then use:
  ```bash
  dfx deploy
  ```
Refer to the Dfinity documentation for further instructions on deploying Python applications.

## Project Structure

ICP-python-basic/
├── README.md           # Project documentation
├── requirements.txt    # Python dependencies
├── app.py              # Main script for ICP demonstration
└── ...                 # Additional files or folders

- app.py: Contains the primary script for this project, demonstrating basic Python functionalities.
- requirements.txt: Lists required packages for running the project.

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue for any bugs, improvements, or new features.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
Enjoy learning and building with ICP Python Basic!
