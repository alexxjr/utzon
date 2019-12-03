/**
 * Creates an update with the specified params
 * Checks what type of update we are working with
 */

function createUpdate(shift, newStart, newEnd, newEmployee){
    let type = "";
    let newStartString = newStart.toISOString();
    let newEndString = newEnd.toISOString();
    if (!shift) {
        type = "createShift"
    } else {
        let oldEmployee = undefined;
        let oldStart = new Date(shift.start).toISOString();
        let oldEnd = new Date(shift.end).toISOString();
        if (shift.employee) {
            oldEmployee = shift.employee;
        }
        if (oldEmployee === undefined && newEmployee !== undefined) {
            type = "addEmployeeToShift";
        }
        if (oldEmployee !== undefined && newEmployee === undefined) {
            type = "removeEmployeeFromShift";
        }
        if (oldStart !== newStartString || oldEnd !== newEndString) {
            if (newStartString !== undefined && newEndString !== undefined) {
                type = "changeShiftTimes";
            }
        }
        if (oldEmployee !== undefined && newEmployee !== undefined) {
        if (oldEmployee.CPR !== newEmployee.CPR) {
            type = "changeShiftEmployee";
        }
        }
        if (oldEmployee !== undefined && newEmployee !== undefined) {
            if (oldEmployee.CPR !== newEmployee.CPR) {
                if (oldStart !== newStartString || oldEnd !== newEndString) {
                    type = "changeShiftTimesAndEmployee";
                }
            }
        }
        if (oldStart !== newStartString || oldEnd !== newEndString) {
            if (oldEmployee === undefined && newEmployee !== undefined) {
                type = "changeShiftTimesAndAddEmployee";
            }
        }
        if (oldStart !== newStartString || oldEnd !== newEndString) {
            if (oldEmployee !== undefined && newEmployee === undefined && newStartString !== undefined && newEndString !== undefined) {
                type = "changeShiftTimesAndRemoveEmployee";
            }
        }
    }
    return {
        shift,
        newStart,
        newEnd,
        newEmployee,
        type
    }

}
