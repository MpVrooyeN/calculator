import { React, useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import './TableStyle.css'
const TABLEDATA = [
	{ first: 7, second: 8, third: 9, fourth: '/' },
	{ first: 4, second: 5, third: 6, fourth: '*' },
	{ first: 1, second: 2, third: 3, fourth: '-' },
	{ first: 0, second: 'C', third: '=', fourth: '+' }]

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
const OPERATORS = ['/', '*', '-', '+']

export const Table = () => {

	const [answerValue, setAnswerValue] = useState(0)
	const [secondValue, setSecondValue] = useState(0)
	const [operator, setOperator] = useState(null)
	const [calculated, setCalculated] = useState(false)
	const [answerText, setAnswerText] = useState(0)

	const columns = useMemo(() => [{
		Header: 'Header',
		hideHeader: false,
		columns: [
			{ Header: '', accessor: 'first' },
			{ Header: '', accessor: 'second' },
			{ Header: '', accessor: 'third' },
			{ Header: '', accessor: 'fourth' }]
	}], []);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: TABLEDATA });

	function calculateResult() {
		switch (operator) {
			case '/':
				setAnswerValue(answerValue / secondValue);
				break;
			case '*':
				setAnswerValue(answerValue * secondValue);
				break;
			case '-':
				setAnswerValue(answerValue - secondValue);
				break;
			case '+':
				setAnswerValue(answerValue + secondValue);
				break;

			default:
				break;
		}
	}

	function calculate(cellValue) {

		if (NUMBERS.includes(cellValue)) {
			if (calculated) {
				setAnswerValue(0)
				setSecondValue(0)
				setCalculated(false)
			}
			if (operator) {
				let result;
				result = secondValue * 10 + cellValue
				setSecondValue(result)
				console.log("second: " + secondValue)
			} else {
				let result;
				result = answerValue * 10 + cellValue
				setAnswerValue(result)
				console.log("answer: " + answerValue)
			}

		} else if (OPERATORS.includes(cellValue)) {
			if (!calculated) {
				calculateResult()
			}

			setCalculated(false)
			setOperator(cellValue)
			setSecondValue(0)
			console.log('pressed operator: ' + cellValue)

		} else if (cellValue === '=') {
			calculateResult()
			setCalculated(true)
			console.log("pressed equals")

		} else if (cellValue === 'C') {
			setAnswerValue(0)
			setSecondValue(0)
			setOperator(null)
			setCalculated(false)
			console.log("cleared")
		}
		
		console.log(answerValue)
	}

	useEffect(() => {
		setAnswerText(answerValue.toString());
	}, [answerValue]);

	return (<div className="container">
		<p id="answerText" className="value">{answerText}</p>
		<table {...getTableProps} className="calculator">
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => {
							return column.hideHeader === false ? null : (
								<th {...column.getHeaderProps()}>
									{column.render('Header')}
								</th>);
						})}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row)
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => {
								return (<td  {...cell.getCellProps()}>
									<button className={cell.column.id + '-' + cell.row.id} onClick={() => { calculate(cell.value); }}>
										<i>{cell.render('Cell')}</i>
									</button>
								</td>)
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	</div>
	);
}