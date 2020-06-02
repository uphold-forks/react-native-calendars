import {Circle, G, Rect} from 'react-native-svg';
import React, {Component, Fragment} from 'react';
import {chunk} from 'lodash';
import {Text, View} from 'react-native';
import Calendar from '../calendar';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import styleConstructor from './style';
import styled from 'styled-components';

const EmptyMonth = styled(View)`
  align-items: center;
  height: ${300}px;
  justify-content: center;
  width: ${300}px;
`;

const LoadingContainer = styled(View)`
  align-items: center;
  height: ${300}px;
  justify-content: center;
  position: absolute;
  width: ${300}px;
  z-index: -1;
`;

class CalendarListItem extends Component {
  static displayName = 'IGNORE';
  
  static defaultProps = {
    hideArrows: true,
    hideExtraDays: true
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;

    return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || !!(r2.propbump && r2.propbump !== r1.propbump);
  }

  onPressArrowLeft = (_, month) => {
    const monthClone = month.clone();

    if (this.props.onPressArrowLeft) {
      this.props.onPressArrowLeft(_, monthClone);
    } else if (this.props.scrollToMonth) {
      const currentMonth = monthClone.getMonth();

      monthClone.addMonths(-1);

      // Make sure we actually get the previous month, not just 30 days before currentMonth.
      while (monthClone.getMonth() === currentMonth) {
        monthClone.setDate(monthClone.getDate() - 1);
      }

      this.props.scrollToMonth(monthClone);
    }
  }

  onPressArrowRight = (_, month) => {
    const monthClone = month.clone();

    if (this.props.onPressArrowRight) {
      this.props.onPressArrowRight(_, monthClone);
    } else if (this.props.scrollToMonth) {
      monthClone.addMonths(1);
      this.props.scrollToMonth(monthClone);
    }
  }

  render() {
    const row = this.props.item;

    return (<Fragment>
      <SvgAnimatedLinearGradient
        height={300}
        primaryColor="#F5F9FC"
        secondaryColor="#E4EAF2"
        width={400}
      >
        <G>
          {chunk(new Array(42), 7).map((rows, rowIndex) =>
            rows.map((value, cellIndex) => (
              <Circle
                cx={40 / 2 + (40 + 16) * cellIndex}
                cy={64 + (40 + 8) * rowIndex}
                fill="#E4EAF2"
                key={`cell_${rowIndex}-${cellIndex}`}
                r={40 / 2}
              />
            ))
          )}
  
          {new Array(7).map((value, index) => (
            <Rect
              fill="#E4EAF2"
              height="12"
              key={`row_${index}`}
              rx="6"
              width={40}
              x={(40 + 16) * index}
              y="12"
            />
          ))}
        </G>
      </SvgAnimatedLinearGradient>

      {row.getTime &&
        <Calendar
          accessibilityElementsHidden={this.props.accessibilityElementsHidden}
          current={row}
          dayComponent={this.props.dayComponent}
          disabledByDefault={this.props.disabledByDefault}
          disableMonthChange
          displayLoadingIndicator={this.props.displayLoadingIndicator}
          firstDay={this.props.firstDay}
          headerStyle={this.props.horizontal ? this.props.headerStyle : undefined}
          hideArrows={this.props.hideArrows}
          hideDayNames={this.props.hideDayNames}
          hideExtraDays={this.props.hideExtraDays}
          importantForAccessibility={this.props.importantForAccessibility}
          markedDates={this.props.markedDates}
          markingType={this.props.markingType}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          monthFormat={this.props.monthFormat}
          onDayLongPress={this.props.onDayLongPress}
          onDayPress={this.props.onDayPress}
          onPressArrowLeft={this.props.horizontal ? this.onPressArrowLeft : this.props.onPressArrowLeft}
          onPressArrowRight={this.props.horizontal ? this.onPressArrowRight : this.props.onPressArrowRight}
          renderArrow={this.props.renderArrow}
          showWeekNumbers={this.props.showWeekNumbers}
          style={[{height: this.props.calendarHeight, width: this.props.calendarWidth}, this.style.calendar, this.props.style]}
          testID={`${this.props.testID}_${row}`} // iOS
          theme={this.props.theme} // Android
        />}
    } 
    </Fragment>);
  }
}

export default CalendarListItem;
