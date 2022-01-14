import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { HiOutlineTrash } from "react-icons/hi";
import Modal from "../../componentns/Modal";

const ModalBody = styled.div`
    width: 100vw;
    max-width: 386px;
    padding: 8px;
`;

const Date = styled.small`
    display: block;
    color: #c9c8cc;
`;

const TodoActionButton = styled.button<{ secondary?: boolean }>`
    border: none;
    background-color: transparent;
    color: ${({ secondary }) => secondary && "#ff6b6b"};
    cursor: pointer;
`;

const TodoActions = styled.span`
    flex: 1 0 5%;
`;
const Content = styled.span`
    flex: 1 0 95%;
`;

const TodoItem = styled.li`
    width: 100%;
    display: flex;
    contain: #c9c8cc;
    align-items: center;
    border-radius: 8px;
`;

const TodoList = styled.ul`
    list-style: circle;
    margin: 0;
    padding: 0;
    width: 100%;
    ${TodoItem} + ${TodoItem} {
        margin-top: 8px;
    }
`;

const Statistics = styled.p`
    color: #7047eb;
    font-size: 16px;
    font-weight: bold;
`;

const Card = styled.div`
    width: 100%;
    max-width: 370px;
    border-radius: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    background-color: #19181a;
    ${Date} + ${TodoList} {
        margin-top: 24px;
    }
`;

const TodoStatisticsModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleClose = () => {
        setIsOpen(false);
    };
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalBody>
                <Card>
                    <Date>2021-09-12</Date>
                    <Statistics>할 일 0개 남음</Statistics>
                    <TodoList>
                        <TodoItem>
                            <Content></Content>
                            <TodoActions>
                                <TodoActionButton>
                                    <HiOutlineTrash />
                                </TodoActionButton>
                            </TodoActions>
                        </TodoItem>
                    </TodoList>
                </Card>
            </ModalBody>
        </Modal>
    );
};

export default TodoStatisticsModal;
