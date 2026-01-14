# Tic-Tac-Toe Game

This is a simple Tic-Tac-Toe game implemented using FastAPI for the backend and HTML, CSS, and JavaScript for the frontend.

## Features

-   Interactive Tic-Tac-Toe board.
-   Player turn management.
-   Win detection with confetti celebration.
-   Draw game detection.
-   Reset game functionality.
-   Visually appealing design with sparkle animation.

## Technologies Used

-   FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.
-   Uvicorn: An ASGI web server implementation for Python.
-   HTML: The standard markup language for creating web pages.
-   CSS: A style sheet language used for describing the presentation of a document written in HTML.
-   JavaScript: A programming language that enables interactive web pages.
-   confetti-js: A javascript library for adding confetti explosions to your website.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/prguptadev/KODE_project_1.git
    cd KODE_project_1
    ```

2.  **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  **Run the application:**

    ```bash
    ./start_app.sh
    ```

    This script starts the FastAPI backend and opens the `index.html` file in your default web browser.

2.  **Play the game:**

    -   Click on the cells to make your move.
    -   The game will automatically detect wins and draws.
    -   Click the "Reset Game" button to start a new game.

## Directory Structure

```
KODE_project_1/
├── app/
│   ├── backend/
│   │   └── main.py         # FastAPI backend application
│   ├── frontend/
│   │   └── index.html      # HTML frontend for the Tic-Tac-Toe game
│   └── static/
│       └── style.css       # CSS stylesheet for styling the game
├── README.md               # This file
├── requirements.txt        # List of Python dependencies
└── start_app.sh            # Script to start the application
```

## License

[MIT](LICENSE)
