import React from "react";
import styled from "@emotion/styled/macro";

import { useRecoilValue, useSetRecoilState } from "recoil";

import { selectedTodoState, Todo } from "./atom";
import { todoStatisticsModalOpenState } from "../TodoStatisticsModal/atom";

const TodoItem = styled.li<{ done?: boolean; selected?: boolean }>`
    max-width: 100px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: ${({ done, selected }) =>
        selected
            ? `rgba(112, 71, 235, 1)`
            : done
            ? `transparent`
            : `rgba(112,71,235,0.4)`};
    padding: 2px 4px;
    margin: 0;
    border-radius: 8px;
    font-size: 10px;
    text-decoration: ${({ done }) => done && "line-through"};
    cursor: pointer;
`;

const EtcItem = styled.li`
    padding: 2px 4px;
    margin: 0;
    font-size: 10px;
    cursor: pointer;
`;

const Base = styled.div`
    list-style: none;
    margin: 36px 0 0 0;
    padding: 0;
    width: 100%;
    height: 60px;
    ${TodoItem} + ${TodoItem} {
        margin-top: 1px;
    }
    ${TodoItem}+${EtcItem} {
        margin-top: 1px;
    }
`;

interface Props {
    items: Array<Todo>;
}

const TodoList: React.FC<Props> = ({ items }) => {
    const selectedTodo = useRecoilValue(selectedTodoState);
    const setSelectedTodo = useSetRecoilState(selectedTodoState);
    const setTodoStateisticsModalOpen = useSetRecoilState(
        todoStatisticsModalOpenState
    );
    const handleClick = (
        e: React.SyntheticEvent<HTMLLIElement>,
        todo: Todo
    ) => {
        e.stopPropagation();

        setSelectedTodo(
            selectedTodo?.id === todo.id && selectedTodo.date === todo.date
                ? null
                : todo
        );
    };
    const handleTodoStaticsModalOpen = (
        e: React.SyntheticEvent<HTMLLIElement>
    ) => {
        e.stopPropagation();
        setTodoStateisticsModalOpen(true);
    };
    return (
        <Base>
            <TodoItem>
                {items.slice(0, 3).map((item, idx) => (
                    <TodoItem
                        key={item.id}
                        done={item.done}
                        onClick={(e) => handleClick(e, item)}
                    >
                        {item.content}
                    </TodoItem>
                ))}
                {items.length > 3 && (
                    <EtcItem onClick={handleTodoStaticsModalOpen}>{`그 외 ${
                        items.length - 3
                    }`}</EtcItem>
                )}
            </TodoItem>
            <EtcItem />
        </Base>
    );
};

export default TodoList;
