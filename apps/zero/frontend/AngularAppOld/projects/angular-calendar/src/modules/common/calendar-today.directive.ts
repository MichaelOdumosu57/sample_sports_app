import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { MwlCalendarViewParams } from './util';

/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
@Directive({
  selector: '[mwlCalendarToday]',
})
export class CalendarTodayDirective {

  @Input('mwlCalendarToday') params? : MwlCalendarViewParams;
  /**
   * The current view date
   */
  @Input() viewDate: Date;

  /**
   * Called when the view date is changed
   */
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  constructor(private dateAdapter: DateAdapter) {}

  /**
   * @hidden
   */
  @HostListener('click')
  onClick(): void {
    if(!this.params.todayView){
      return
    }
    this.viewDateChange.emit(this.dateAdapter.startOfDay(new Date()));
  }
}
