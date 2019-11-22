exports.createUpdate = createUpdate;
function createUpdate(shift, newStart, newEnd, newEmployee){
    let type = "";
    if (!shift) {
        type = "createShift"
    } else {
        let oldStart = shift.start;
        let oldEnd = shift.end;
        let oldEmployee = shift.employee;

        if (newStart === undefined && newEnd === undefined && newEmployee === undefined) {
            type = "deleteShift";
        }
        if (oldEmployee === undefined && newEmployee !== undefined) {
            type = "addEmployeeToShift";
        }
        if (oldEmployee !== undefined && newEmployee === undefined) {
            type = "removeEmployeeFromShift";
        }
        if (oldStart !== newStart || oldEnd !== newEnd && newStart !== undefined && newEnd !== undefined) {
            type = "changeShiftTimes";
        }
        if (oldEmployee !== newEmployee && oldEmployee !== undefined && newEmployee !== undefined) {
            type = "changeShiftEmployee";
        }
        if (oldStart !== newStart || oldEnd !== newEnd && oldEmployee !== newEmployee
            && oldEmployee !== undefined && newEmployee !== undefined) {
            type = "changeShiftTimesAndEmployee";
        }
        if (oldStart !== newStart || oldEnd !== newEnd && oldEmployee === undefined && newEmployee !== undefined) {
            type = "changeShiftTimesAndAddEmployee";
        }
        if (oldStart !== newStart || oldEnd !== newEnd && oldEmployee !== undefined
            && newEmployee === undefined && newStart !== undefined && newEnd !== undefined) {
            type = "changeShiftTimesAndRemoveEmployee";
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



