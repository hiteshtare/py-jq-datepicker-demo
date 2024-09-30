$(document).ready(function () {
  $(function () {
    $('#input_57_5').datepicker({
      inline: true,
      altField: '#input_57_5_text',
    });
    $('#input_57_4').datepicker({
      inline: true,
      altField: '#input_57_4_text',
    });

    var datepickerArrivalDate = $('#input_57_5');
    var datepickerDepartureDate = $('#input_57_4');
    var dropdownPurposeOfVisit = $('#input_57_1');

    var disabledDays = [];
    var php_data = [
      {
        restricted: "",
        purpose: '--Select--',
      },
      {
        restricted: "'15-Sep-2024','16-Sep-2024','30-Sep-2024'",
        purpose: 'Individual Retreat',
      },
      {
        restricted: "'25-Sep-2024','26-Sep-2024','05-Oct-2024'",
        purpose: 'Long Meditation',
      },
      {
        restricted:
          "'28-Sep-2024','29-Sep-2024','17-Oct-2024','18-Oct-2024', '19-Oct-2024', '20-Oct-2024','14-Nov-2024','15-Nov-2024', '16-Nov-2024', '17-Nov-2024'",
        purpose: 'Conducted Retreat',
      },
    ];

    //Populdate Dropdown 
    var $dropdown = $("#input_57_1");
    $.each(php_data, function () {
      $dropdown.append($("<option />").val(this.purpose).text(this.purpose));
    });

    // Assign Date datepicker options to variable
    var optionsArrivalDate = datepickerArrivalDate.datepicker('option', 'all');
    var optionsDepartureDate = datepickerDepartureDate.datepicker(
      'option',
      'all'
    );

    // Copy of restore options when required
    var optionsArrivalDateCopy = Object.assign([], optionsArrivalDate);
    var optionsDepartureDateCopy = Object.assign([], optionsDepartureDate);

    // Default value for Purpose of visit dropdown 
    const defaultValue = "Individual Retreat";
    $("#input_57_1").val(defaultValue);
    updateDatepickerOnDropdownChange(defaultValue);

    // Change event for Purpose of visit dropdown
    dropdownPurposeOfVisit.on('change', function () {
      console.log('You selected: ', this.value);

      updateDatepickerOnDropdownChange(this.value);
    });

    function updateDatepickerOnDropdownChange(currenValue) {
      //Filter array based on value selected to get Array of different years
      const foundDates = php_data.filter((x) => x.purpose === currenValue);
      console.warn('foundDates');
      console.log(foundDates);

      /* 
         Merge array of same value to have Single string array for 
         Datepicker to be supported
      */
      let mergedArray = [];
      foundDates.forEach(function (item) {
        var existing = mergedArray.filter(function (v, i) {
          return v.name == item.name;
        });
        if (existing.length) {
          var existingIndex = mergedArray.indexOf(existing[0]);
          mergedArray[existingIndex].restricted = mergedArray[
            existingIndex
          ].restricted.concat(item.restricted);
        } else {
          if (typeof item.restricted == 'string')
            item.restricted = [item.restricted];
          mergedArray.push(item);
        }
      });

      //Destroy current datepicker
      datepickerArrivalDate.datepicker('destroy');
      datepickerDepartureDate.datepicker('destroy');

      // To check mergedArray is not empty
      if (mergedArray.length !== 0) {
        console.warn('Datepicker: update mergedArray to Block Dates');
        console.log(mergedArray);

        //Take single value of string array and final merge into single string
        disabledDays = mergedArray[0].restricted.join('');
        console.log(disabledDays);

        /*------------------------ DATEPICKER ------------------------*/
        //Update with beforeShowDay function with set of Block Dates
        optionsArrivalDate.beforeShowDay = function (date) {
          var checkdate = $.datepicker.formatDate('dd-M-yy', date);
          return [disabledDays.indexOf(checkdate) == -1];
        };
        optionsDepartureDate.beforeShowDay = function (date) {
          var checkdate = $.datepicker.formatDate('dd-M-yy', date);
          return [disabledDays.indexOf(checkdate) == -1];
        };

        //Re-initialise datepicker
        datepickerArrivalDate.datepicker(optionsArrivalDate);
        datepickerDepartureDate.datepicker(optionsDepartureDate);
        /*------------------------ DATEPICKER ------------------------*/
      } else {
        console.warn('Datepicker: Restore back to original state');

        //Restore back to original options
        datepickerArrivalDate.datepicker(optionsArrivalDateCopy);
        datepickerDepartureDate.datepicker(optionsDepartureDateCopy);
      }
    }
  });
});
