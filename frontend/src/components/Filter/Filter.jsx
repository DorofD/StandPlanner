import React from "react";
// import { ReactComponent as FilterIcon } from './filter.svg';
import FilterIcon from './filter.svg';
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
            <FilterIcon style={{ color: 'var(--accent-color)', width: 40, height: 40 }} />
            {children}
            <Button onClick={onClick}>Очистить</Button>
        </div>
    );
}
