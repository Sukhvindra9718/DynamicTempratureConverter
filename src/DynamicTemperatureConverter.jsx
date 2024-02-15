import { Fragment, createElement, useEffect, useState } from "react";
import "./ui/DynamicTemperatureConverter.css";
import classNames from "classnames";

export function DynamicTemperatureConverter(props) {
    // const [values, setValues] = useState();
    const [dec, setDec] = useState("");

    async function callMicroflow(eVal) {
        const decValue = calculateAfterChangeTempUnit(eVal)
        // Set TextValue
        props.inputValue.setTextValue(parseFloat(decValue).toFixed(6));
        if (props.onChange && props.onChange.canExecute) {
            setTimeout(() => {
                props.onChange.execute();
            }, 300);
        }
    }
    const handleChange = e => {
        setDec(e.target.value);

        const myTimeout = setTimeout(() => {
            callMicroflow(e.target.value);
        }, 2000);
        return () => clearTimeout(myTimeout);



    };
    const handleFocus = event => event.target.select();

    const handleFocusOut = () => {
        // Call a microflow
        if (props.onBlurChange && props.onBlurChange.canExecute) {
            props.onBlurChange.execute();
        }
    };
    const calculateTempUnit = () => {
        // setValues(parseFloat(props.inputValue.displayValue));

        if (props.inputConversionRate === "C") {
            var ans = isNaN(parseFloat(props.inputValue.displayValue)) ? '' : props.inputValue.displayValue;
        } else if (props.inputConversionRate === "F") {
            var ans = isNaN(parseFloat(props.inputValue.displayValue)) ? '' : (parseFloat(props.inputValue.displayValue) * 9) / 5 + 32;
        } else if (props.inputConversionRate === "K") {
            var ans = isNaN(parseFloat(props.inputValue.displayValue)) ? '' : parseFloat(props.inputValue.displayValue) + 273.15;
        }
        if(props.inputValue.displayValue === ''){
            setDec("");
            return;
        }
        var precise = parseFloat(ans).toFixed(props.decimalPrecision.value);
        setDec(precise);
    };
    const calculateAfterChangeTempUnit = (inputValue) => {
        console.log("onchange",inputValue)
        if (props.inputConversionRate === "C") {
            var ans = isNaN(parseFloat(inputValue)) ? '' : parseFloat(inputValue);
            console.log("ansC", ans)
        } else if (props.inputConversionRate === "F") {
            var ans = isNaN(parseFloat(inputValue)) ? '' : (5 / 9) * (parseFloat(inputValue) - 32);
            console.log("ansF", ans)
        } else if (props.inputConversionRate === "K") {
            var ans = isNaN(parseFloat(inputValue)) ? '' : (parseFloat(inputValue) - 273.15)
            console.log("ansK", ans)
        }

        var precise = (parseFloat(ans).toFixed(props.decimalPrecision.value))
        return precise;
    }
    useEffect(() => {
        calculateTempUnit();
    }, [props.inputConversionRate, props.inputValue]);

    console.log(props)
    return (
        <Fragment>
            <div
                style={props.style}
                className={classNames(props.class, "form-group", "dynamicMeasurementConverterInput")}
            >
                <input
                    type="text"
                    value={dec}
                    placeholder={props.placeholder}
                    onFocus={e => {
                        handleFocus(e);
                    }}
                    onBlur={e => {
                        handleFocusOut(e);
                    }}
                    onChange={e => handleChange(e)}
                    onKeyDown={evt =>
                        ["e", "E", "+", "-", "ArrowDown", "ArrowUp"].includes(evt.key) && evt.preventDefault()
                    }
                    className="form-control"
                    autoComplete="on"
                    disabled={props?.inputValue?.readOnly}
                />
               {props.unit && <div>
                    {props.inputConversionRate.displayValue === "C" && <span className="unitLabel">℃</span>}
                    {props.inputConversionRate.displayValue === "F" && <span className="unitLabel">℉</span>}
                    {props.inputConversionRate.displayValue === "K" && <span className="unitLabel">°K</span>}
                </div>}

            </div>
        </Fragment>
    );
}
