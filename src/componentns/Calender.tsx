import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled/macro";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import { isSameDay } from "../utils/date";
import {
    selectedDateState,
    selectedTodoState,
    todoListState,
} from "../features/TodoList/atom";
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from "recoil";
import CalendarDay from "./CalendarDay";
import { KeyboardEvent } from "react";

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    margin: 0;
    padding: 8px 24px;
    font-size: 24px;
    font-weight: normal;
    text-align: center;
    color: #f8f7fa;
`;

const ArrowButton = styled.button<{ pos: "left" | "right" }>`
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    background-color: transparent;
    font-size: 18px;
    cursor: pointer;
    color: #f8f7fa;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    border-spacing: 0;
`;

const TableHeader = styled.thead`
    padding-block: 12px;
    > tr {
        > th {
            padding-block: 12px;
            font-weight: normal;
            color: #f8f7fa;
        }
    }
`;

const TableBody = styled.tbody``;

const TableData = styled.td`
    text-align: center;
    color: #c9c8cc;
    padding: 8px;
    position: relative;
`;

const DisplayDate = styled.div<{ isToday?: boolean; isSelected?: boolean }>`
    color: ${({ isToday }) => isToday && "#F8F7FA"};
    background-color: ${({ isToday, isSelected }) =>
        isSelected ? "#7047EB" : isToday ? "#313133" : ""};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    align-self: flex-end;
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    cursor: pointer;
`;

const Base = styled.div`
    width: 100%;
    height: 100vh;
    padding: 24px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    background-color: #28272a;
    ${Header} + ${Table} {
        margin-top: 36px;
    }
`;

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // 요일

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]; // 달

const Calendar: React.FC = () => {
    const selectedDate = useRecoilValue(selectedDateState);
    const todoList = useRecoilValue(todoListState);
    const setSelectedDate = useSetRecoilState(selectedDateState);

    const { year, month, firstDay, lastDay } = useMemo(() => {
        // 선택한 날을 기준으로 첫째 날, 마지막 날, 년, 월 계
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        return {
            year,
            month,
            firstDay: new Date(year, month, 1),
            lastDay: new Date(year, month + 1, 0),
        };
    }, [selectedDate]);

    const selectDate = (date: Date) => {
        // 날짜를 선택한다.
        setSelectedDate(date);
    };

    const pad = () =>
        [...Array(firstDay.getDay()).keys()].map((p: number) => (
            <TableData key={`pad_${p}`} />
        )); // 해당 월의 첫째 날 전 pad

    const range = () =>
        [...Array(lastDay.getDate()).keys()].map((d: number) => {
            // 1일 부터 마지막 날까지 날짜 표기
            const thisDay = new Date(year, month, d + 1);

            return <CalendarDay date={thisDay} />;
        });

    const render = () => {
        // table data 를 일주일 단위로 줄바꿈한다.
        const items = [...pad(), ...range()];

        const weeks = Math.ceil(items.length / 7);

        return [...Array(weeks).keys()].map((week: number) => (
            <tr key={`week_${week}`}>{items.slice(week * 7, week * 7 + 7)}</tr>
        ));
    };

    const removeTodo = useRecoilCallback(
        ({ snapshot, set }) =>
            () => {
                const todoList = snapshot.getLoadable(todoListState).getValue();
                const selectedTodo = snapshot
                    .getLoadable(selectedTodoState)
                    .getValue();

                set(
                    todoListState,
                    todoList.filter((todo) => todo.id !== selectedTodo?.id)
                );
            },
        [selectedDate, todoList]
    );

    useEffect(() => {
        const onBackspaceKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                removeTodo();
            }
        };
        window.addEventListener(keydown, onBackspaceKeyDown);
        return () => {};
    }, [removeTodo]);

    return (
        <Base>
            <Header>
                <ButtonContainer>
                    <ArrowButton
                        pos="left"
                        onClick={() =>
                            selectDate(
                                new Date(
                                    selectedDate.setMonth(
                                        selectedDate.getMonth() - 1
                                    )
                                )
                            )
                        }
                    >
                        <BiChevronLeft />
                    </ArrowButton>
                    <Title>{`${MONTHS[month]} ${year}`}</Title>
                    <ArrowButton
                        pos="right"
                        onClick={() =>
                            selectDate(
                                new Date(
                                    selectedDate.setMonth(
                                        selectedDate.getMonth() + 1
                                    )
                                )
                            )
                        }
                    >
                        <BiChevronRight />
                    </ArrowButton>
                </ButtonContainer>
            </Header>
            <Table>
                <TableHeader>
                    <tr>
                        {DAYS.map((day, index) => (
                            <th key={day} align="center">
                                {day}
                            </th>
                        ))}
                    </tr>
                </TableHeader>
                <TableBody>{render()}</TableBody>
            </Table>
        </Base>
    );
};

export default Calendar;
