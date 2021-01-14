import React, { Component } from 'react';
import {
    bool,
    func,
    number,
    object,
    oneOfType,
    shape,
    string,
} from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

export default class ClickableDate extends Component {
    componentDidMount() {
        this.focusIfNeeded();
    }

    componentDidUpdate() {
        this.focusIfNeeded();
    }

    focusIfNeeded() {
        const { date, isFocusingHeader, dateButtonRef } = this.props;
        if (date.isFocus && !isFocusingHeader) {
            dateButtonRef.current.focus();
        }
    }

    dateClassName() {
        const { date, isFocusingHeader } = this.props;
        const { isEnabled, isFocus, isSelected, isToday } = date;

        return classNames({
            'ffe-calendar__date': true,
            'ffe-calendar__date--today': isToday,
            'ffe-calendar__date--focus': isFocus && !isFocusingHeader,
            'ffe-calendar__date--disabled': !isEnabled,
            'ffe-calendar__date--selected': isSelected,
            'ffe-calendar__date--disabled-focus': !isEnabled && isFocus,
        });
    }

    tabIndex() {
        return this.props.date.isFocus ? 0 : -1;
    }

    render() {
        const {
            date,
            headers,
            onClick,
            language,
            dateButtonRef,
            month,
        } = this.props;
        const year = moment(date.timestamp).format('yyyy');
        const momentDate = moment(date);
        const dayOfMonth = momentDate.format('D');
        const monthName = language === 'en' ? month : month.toLowerCase();

        return (
            <td
                className="ffe-calendar__day"
                headers={headers}
                role="button"
                ref={dateButtonRef}
                aria-disabled={!date.isEnabled}
                aria-selected={date.isSelected}
                aria-label={`${dayOfMonth}. ${monthName} ${year}`}
                tabIndex={this.tabIndex()}
                onClick={() => onClick(date)}
            >
                <span className={this.dateClassName()} aria-hidden="true">
                    {date.date}
                </span>
            </td>
        );
    }
}

ClickableDate.propTypes = {
    date: shape({
        date: oneOfType([func, number]),
        isEnabled: bool,
        isFocus: bool,
        isSelected: bool,
        isToday: bool,
    }).isRequired,
    month: string.isRequired,
    headers: string.isRequired,
    onClick: func.isRequired,
    language: string.isRequired,
    dateButtonRef: object,
    isFocusingHeader: bool.isRequired,
};
