import { useMemo } from "react";
import { useTable } from "react-table";

const tableData = [
	{
		first: 7,
		second: 8,
		third: 9,
		fourth: '/'

	},
	{
		first: 4,
		second: 5,
		third: 6,
		fourth: '*'

	},
	{
		first: 1,
		second: 2,
		third: 3,
		fourth: '+'

	},
	{
		first: 0,
		second: '=',
		third: '.',
		fourth: '-'

	}
]

export const Table = () => {
	const data = tableData;
	let answerValue = 0
	const columns = useMemo(() => [{
		Header: 'Header',
		hideHeader: false,
		columns: [
			{
				Header: '',
				accessor: 'first'
			},
			{
				Header: '',
				accessor: 'second'
			},
			{
				Header: '',
				accessor: 'third'
			},
			{
				Header: '',
				accessor: 'fourth'
			}
		]
	}], []);
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

	let operatorClicked = false
	let history = false
	let setOperator = null
	let secondValue = 0
	const answerText = document.getElementById('answerText');
	function clear() {
		answerValue = 0
		secondValue = 0
		operatorClicked = false
		history = false
		answerText.innerHTML = answerValue
	}
	function calculate(cellValue) {
		const operators = ['/', '*', '-', '+']
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
		console.log("Pushed: " + cellValue)
		console.log('Answer= ' + answerValue)
		console.log('Second: ' + secondValue)
		if (numbers.includes(cellValue)) {
			if (history) {
				clear()
			} else {
				if (!operatorClicked) {
					answerValue = (10 * answerValue) + cellValue
				} else {
					secondValue = (10 * secondValue) + cellValue
				}
			}
		} else if (operators.includes(cellValue)) {
			history = false
			operatorClicked = true
			if (secondValue !== 0) {
				calculateOperation()
			}
			setOperator = cellValue

		} else if (cellValue === '=') {
			history = true
			calculateOperation()
			answerText.innerHTML = answerValue
			setOperator = null
			operatorClicked = false
		}
		function calculateOperation() {
			switch (setOperator) {
				case '+':
					answerValue = answerValue + secondValue
					break;

				case '-':
					answerValue = answerValue - secondValue
					break;

				case '*':
					answerValue = answerValue * secondValue
					break;

				case '/':
					answerValue = answerValue / secondValue
					break;

				default:
					break;
			}
		}
		answerText.innerHTML = answerValue
	}

	return (<>
		<span id="answerText"></span>
		<button onClick={() => { clear() }}>Clear</button>
		<table {...getTableProps}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => {
							return column.hideHeader === false ? null : (
								<th {...column.getHeaderProps()}>
									{column.render('Header')}
								</th>);
						}
						)}
					</tr>
				))
				}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row)
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => {

								return (
									<td {...cell.getCellProps()}><button onClick={() => { calculate(cell.value) }}>{cell.render('Cell')}</button></td>)
							})}</tr>)
				})}
			</tbody>
		</table></>
	);
}


