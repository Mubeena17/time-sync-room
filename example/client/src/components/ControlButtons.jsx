export default function ControlButtons(props) {
    const StartButton = <button onClick={props.handleStart}>Start</button>;
    const ActiveButtons = (
        <div className="btn-grp">
            <button onClick={props.handleReset}>Reset</button>
            <button
                onClick={
                    props.isPaused ? props.handleResume : props.handlePause
                }
            >
                {props.isPaused ? "Resume" : "Pause"}
            </button>
        </div>
    );

    return (
        <div>
            <div>{props.active ? ActiveButtons : StartButton}</div>
        </div>
    );
}
