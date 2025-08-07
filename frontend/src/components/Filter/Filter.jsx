import React from "react";
import filterLogo from './filter.png'
import Button from "../Button/Button";
import "./Filter.css"
/**
 * Компонент фильтрации логов.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Элементы фильтра: input и select, например:
 * 
 * <input type="text" className="filter" placeholder="Текст записи" onChange={e => setFilterLogs({ ...filterLogs, note: e.target.value })} value={filterLogs.note} />
 * 
 * @param {React.ReactNode} props.onClick - функция очистки фильтра, например:
 * onClick={() => setFilterLogs({ datetime: '', status: '', note: '' })}
 * 
 * 
 */
export default function Filter({ children, onClick }) {

    return (
        <div className="filterContainer">
            <img src={filterLogo} alt="" className="filterLogo" />
            {children}
            <Button style={"standartNeutral"} onClick={onClick}>Очистить</Button>
        </div>
    );
}
