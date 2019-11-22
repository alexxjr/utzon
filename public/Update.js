exports.createUpdate = createUpdate;
function createUpdate(shift, newStart, newEnd, newEmployee){
    let type = "";
    let newStartString = newStart.toISOString();
    let newEndString = newEnd.toISOString();
    if (!shift) {
        type = "createShift"
    } else {
        let oldStart = new Date(shift.start).toISOString();
        let oldEnd = new Date(shift.end).toISOString();
        let oldEmployee = shift.employee.name;

        if (newStartString === undefined && newEndString === undefined && newEmployee === undefined) {
            type = "deleteShift";
        }
        if (oldEmployee === undefined && newEmployee !== undefined) {
            type = "addEmployeeToShift";
        }
        if (oldEmployee !== undefined && newEmployee === undefined) {
            type = "removeEmployeeFromShift";
        }
        if (oldStart !== newStartString || oldEnd !== newEndString && newStartString !== undefined && newEndString !== undefined) {
            type = "changeShiftTimes";
        }
        if (oldEmployee !== newEmployee && oldEmployee !== undefined && newEmployee !== undefined) {
            type = "changeShiftEmployee";
        }
        if (oldStart !== newStartString || oldEnd !== newEndString && oldEmployee !== newEmployee
            && oldEmployee !== undefined && newEmployee !== undefined) {
            type = "changeShiftTimesAndEmployee";
        }
        if (oldStart !== newStartString || oldEnd !== newEndString && oldEmployee === undefined && newEmployee !== undefined) {
            type = "changeShiftTimesAndAddEmployee";
        }
        if (oldStart !== newStartString || oldEnd !== newEndString && oldEmployee !== undefined
            && newEmployee === undefined && newStartString !== undefined && newEndString !== undefined) {
            type = "changeShiftTimesAndRemoveEmployee";
        }
    }
    return {
        shift,
        newStart: newStartString,
        newEnd: newEndString,
        newEmployee: newEmployee,
        type
    }

}



