import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormStyled, InputStyled, TDStyled, DivStyledCSV, TRStyled, ButtonStyled, TableStyled, THStyled, DivStyledTable } from './Styles';

export const EthereumStakingCalculator = () => {
    const [investment, setInvestment] = useState('');
    const [rate, setRate] = useState('');
    const [duration, setDuration] = useState('');
    const [reinvest, setReinvest] = useState(true);
    const [time, setTime] = useState('');
    const [schedule, setSchedule] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let investmentAmount = investment;
        const lowerRateDate = new Date('2023-04-15');
        let newRate = rate;

        const updatedSchedule = [];

        for (let i = 0; i < duration; i++) {
            const date = new Date(time);
            date.setMonth(date.getMonth() + i);

            if (date >= lowerRateDate) {
                newRate = 8;
            }

            const reward = (investmentAmount * (newRate / 100) * 30) / 365;

            updatedSchedule.push({
                line: i + 1,
                date: date.toLocaleDateString('default', { month: 'numeric', day: 'numeric', year: 'numeric' }),
                investment: investmentAmount,
                reward: reward,
                total: investmentAmount + reward,
                rate: newRate
            });

            if (reinvest) {
                investmentAmount += reward;
            }
        }

        setSchedule(updatedSchedule.map(item => {
            return {
                ...item,
                investment: item.investment.toFixed(6),
                reward: item.reward.toFixed(6),
                total: item.total.toFixed(6),
                rate: item.rate.toFixed(2)
            }
        }));
    }

    const headers = [
        { label: "Line", key: "line" },
        { label: "Reward Date", key: "date" },
        { label: "Investment Amount", key: "investment" },
        { label: "Reward Amount", key: "reward" },
        { label: "Total Reward Amount To Date", key: "total" },
        { label: "Staking Reward Rate", key: "rate" }
    ];

    return (
        <>
            <div>
                <FormStyled onSubmit={handleSubmit}>
                    <label>
                        Initial Investment:
                        <InputStyled type="number" placeholder='Amount' required value={investment}
                            onChange={e => setInvestment(Number(e.target.value))} />
                    </label>
                    <label>
                        Yearly Staking Reward:
                        <InputStyled type="number" placeholder='%' required value={rate}
                            onChange={e => setRate(Number(e.target.value))} />
                    </label>
                    <label>
                        Duration (months):
                        <InputStyled type="number" placeholder='Number of months' required value={duration}
                            onChange={e => setDuration(e.target.value)} />
                    </label>
                    <label>
                        Start Date:
                        <InputStyled type='date' required value={time} onChange={e => setTime(e.target.value)} />
                    </label>
                    <label>
                        Reinvest Staking Reward:
                        <InputStyled type="checkbox" checked={reinvest} onChange={e => setReinvest(Number(e.target.checked))} />
                    </label>
                    <ButtonStyled type="submit">Calculate</ButtonStyled>
                </FormStyled>
                <DivStyledTable>
                    <TableStyled>
                        <thead>
                            <TRStyled>
                                <THStyled>Line</THStyled>
                                <THStyled>Reward Date</THStyled>
                                <THStyled>Investment Amount</THStyled>
                                <THStyled>Reward Amount</THStyled>
                                <THStyled>Total Reward Amount To Date</THStyled>
                                <THStyled>Staking Reward Rate</THStyled>
                            </TRStyled>
                        </thead>
                        <tbody>
                            {schedule.map(item => (
                                <TRStyled key={item.line}>
                                    <TDStyled>{item.line}</TDStyled>
                                    <TDStyled>{item.date}</TDStyled>
                                    <TDStyled>{item.investment}</TDStyled>
                                    <TDStyled>{item.reward}</TDStyled>
                                    <TDStyled>{item.total}</TDStyled>
                                    <TDStyled>{item.rate}%</TDStyled>
                                </TRStyled>
                            ))}
                        </tbody>
                    </TableStyled>
                </DivStyledTable>
            </div>
            <DivStyledCSV>
                <CSVLink data={schedule} headers={headers} filename='Ethereum.csv' separator={';'}>Download CSV file</CSVLink>
            </DivStyledCSV>
        </>
    )
};