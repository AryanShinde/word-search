import React, { useEffect, useRef, useState } from "react";
import uploadIcon from "./upload.svg";
import "./App.css";
import { clearGrid, drawGrid, drawMatch, parseFile } from "./util";
import { Wordsearch } from "./wordsearch";

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const [puzzle, setPuzzle] = useState<Wordsearch>();

    const openFileInput = () => {
        fileInput.current?.click();
    };

    const onFileChange = async () => {
        console.log("on change");
        var file = fileInput.current?.files?.[0];
        if (!file) return;

        let wordsearch = await parseFile(file);
        setPuzzle(wordsearch);
    };

    const solvePuzzle = () => {
        if (!(canvas.current && puzzle)) return;
        const matches = puzzle.solve();
        for (let match of matches) {
            if (match.length > 0) {
                drawMatch(canvas.current, match);
            }
        }
    };

    const clearPuzzle = () => {
        if (!(canvas.current && puzzle)) return;

        setPuzzle(undefined);
        clearGrid(canvas.current);

        if (fileInput.current) {
            fileInput.current.value = "";
        }
    };

    useEffect(() => {
        if (!(canvas.current && puzzle)) return;
        drawGrid(canvas.current, puzzle);
    }, [puzzle]);

    return (
        <div className="App">
            <header className="App-header">Wordsearch Solver</header>
            <input
                type="file"
                accept="text/plain"
                ref={fileInput}
                onChange={onFileChange}
                style={{ display: "none" }}
            />
            <button
                type="button"
                onClick={openFileInput}
                className="App-fileInput"
            >
                <img
                    src={uploadIcon}
                    alt="Upload a file"
                    className="App-icon"
                />
            </button>
            <div className="App-buttons">
                {puzzle && (
                    <>
                        <button type="button" onClick={solvePuzzle}>
                            Solve
                        </button>
                        <button type="button" onClick={clearPuzzle}>
                            Clear
                        </button>
                    </>
                )}
            </div>
            <canvas ref={canvas} />
        </div>
    );
}

export default App;
