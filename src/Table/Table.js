import { useMemo, useState } from "react";
import { useTable } from "react-table";
import './TableStyle.css'
const tableData = [
	{ first: 7, second: 8, third: 9, fourth: '/' },
	{ first: 4, second: 5, third: 6, fourth: '*' },
	{ first: 1, second: 2, third: 3, fourth: '-' },
	{ first: 0, second: 'C', third: '=', fourth: '+' }]

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
const operators = ['/', '*', '-', '+']
let answerValue = 0
let secondValue = 0
let setOperator = null
let calculated = false

export const Table = () => {
	const [answerText, setAnswerText] = useState(0)
	const data = tableData;
	const columns = useMemo(() => [{
		Header: 'Header',
		hideHeader: false,
		columns: [
			{ Header: '', accessor: 'first' },
			{ Header: '', accessor: 'second' },
			{ Header: '', accessor: 'third' },
			{ Header: '', accessor: 'fourth' }]
	}], []);
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
	function clear() {
		answerValue = 0
		secondValue = 0
		setOperator = null
		calculated = false
		console.log("cleared")
	}

	function calculateOperation() {
		switch (setOperator) {
			case '/':
				answerValue = answerValue / secondValue;
				break;
			case '*':
				answerValue = answerValue * secondValue;
				break;
			case '-':
				answerValue = answerValue - secondValue;
				break;
			case '+':
				answerValue = answerValue + secondValue;
				break;

			default:
				break;
		}
	}

	function calculate(cellValue) {
		if (numbers.includes(cellValue)) {
			if (calculated) {
				answerValue = 0
				secondValue = 0
				calculated = false
			}
			if (setOperator) {
				secondValue = secondValue * 10 + cellValue
				console.log("second: " + secondValue)
			} else {
				answerValue = answerValue * 10 + cellValue
				console.log("answer: " + answerValue)
			}

		} else if (operators.includes(cellValue)) {
			if (!calculated) {
				calculateOperation()
			}
			calculated = false
			setOperator = cellValue
			secondValue = 0
			console.log('pressed operator: ' + cellValue)
		} else if (cellValue === '=') {
			calculateOperation()
			calculated = true
			console.log("pressed equals")
		} else if (cellValue === 'C') {
			clear()
		}
		console.log(answerValue)
		setAnswerText(answerValue)
	}

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