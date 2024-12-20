$(document).ready(function () {
  var datepickerArrivalDate = $('#input_57_5');
  var datepickerDepartureDate = $('#input_57_4');
  var dropdownPurposeOfVisit = $('#input_57_1');

  var disabledDays = [];
  var arrDisabledDays = [];
  const maxStayDuration = 9;
  const bookingHorizon = 180;
  const arrivalCutoff = 1;
  console.warn('maxStayDuration: ' + maxStayDuration);
  console.warn('bookingHorizon: ' + bookingHorizon);
  console.warn('arrivalCutoff: ' + arrivalCutoff);

  const php_data = [
    {
      name: '--Select--',
      label: '--Select--',
      startdate: '',
      enddate: '',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 1,
      name: 'Individual Retreat',
      label: 'Individual Retreat',
      startdate: '10-Nov-2025',
      enddate: '12-Nov-2025',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 1,
      name: 'Individual Retreat',
      label: 'Individual Retreat',
      startdate: '25-Nov-2025',
      enddate: '30-Nov-2025',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '12-Nov-2025',
      enddate: '13-Nov-2025',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '19-Nov-2025',
      enddate: '20-Nov-2025',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '26-Nov-2025',
      enddate: '27-Nov-2025',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 3,
      name: 'Conducted Retreat',
      label: 'Conducted Retreat',
      startdate: '25-Nov-2025',
      enddate: '27-Nov-2025',
      status: true,
    },

    {
      enterid: 36,
      centername: "Ranchi",
      purpose_id: 4,
      name: 'Other',
      label: 'Other',
      startdate: '29-Nov-2025',
      enddate: '31-Nov-2025',
      status: false,
    }
  ];

  $(function () {
    datepickerArrivalDate.datepicker({
      inline: true,
      altField: '#input_57_5_text',
      dateFormat: 'dd-M-yy',
      minDate: arrivalCutoff,
      maxDate: bookingHorizon,
      // firstDay: 1
    });
    datepickerDepartureDate.datepicker({
      inline: true,
      altField: '#input_57_4_text',
      dateFormat: 'dd-M-yy',
      minDate: arrivalCutoff,
      maxDate: bookingHorizon,
      // firstDay: 1
    });

    //Populdate Dropdown with Unique Value
    const key = 'name';
    const unique_data = [...new Map(php_data.map(item =>
      [item[key], item])).values()];
    $.each(unique_data, function () {
      //Check if status (Visible dropdown) is true
      if (this.status) {
        dropdownPurposeOfVisit.append($("<option />").val(this.name).text(this.name));
      }
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
    dropdownPurposeOfVisit.val(defaultValue);
    updateDatepickerOnDropdownChange(defaultValue);

    // Change event for Purpose of visit dropdown
    dropdownPurposeOfVisit.on('change', function () {
      console.log('You selected: ', this.value);

      updateDatepickerOnDropdownChange(this.value);
    });

    function updateDatepickerOnDropdownChange(currenValue) {
      console.warn('php_data');
      console.log(php_data);
      //Filter array based on value selected to get Array of different years
      const foundData = php_data.filter((x) => x.name === currenValue);
      console.warn('foundData');
      console.log(foundData);

      /* 
         Merge array of same value to have Single string array for 
         Datepicker to be supported
      */
      let mergedArray = foundData;

      //Destroy current datepicker
      datepickerArrivalDate.datepicker('destroy');
      datepickerDepartureDate.datepicker('destroy');

      // To check mergedArray is not empty
      if (mergedArray.length !== 0) {
        console.warn('Datepicker: update mergedArray to Block Dates');
        console.warn(`mergedArray`);
        console.log(mergedArray);

        disabledDays = [];
        arrDisabledDays = [];

        mergedArray.forEach(function (item) {
          disabledDays += getDates(new Date(item.startdate), new Date(item.enddate));
          const disableDays = getDates(new Date(item.startdate), new Date(item.enddate));
          arrDisabledDays.push(...disableDays);
        });

        console.warn(`disabledDays`);
        console.log(disabledDays);
        console.warn(`arrDisabledDays`);
        console.log(arrDisabledDays);

        /*------------------------ RESTRICTED ------------------------*/
        //Update with beforeShowDay function with set of Block Dates
        optionsArrivalDate.beforeShowDay = function (date) {
          var checkdate = $.datepicker.formatDate('dd-M-yy', date);
          return [disabledDays.indexOf(checkdate) == -1];
        };
        optionsDepartureDate.beforeShowDay = function (date) {
          var checkdate = $.datepicker.formatDate('dd-M-yy', date);
          return [disabledDays.indexOf(checkdate) == -1];
        };
        /*------------------------ RESTRICTED ------------------------*/

        /*------------------------ START DATE ------------------------*/
        // optionsArrivalDate.minDate = new Date(foundData[0]['startdate']);
        // optionsDepartureDate.minDate = new Date(foundData[0]['startdate']);
        // /*------------------------ START DATE ------------------------*/

        // /*------------------------ END DATE ------------------------*/
        // optionsArrivalDate.maxDate = new Date(foundData[0]['enddate']);
        // optionsDepartureDate.maxDate = new Date(foundData[0]['enddate']);
        // /*------------------------ END DATE ------------------------*/

        // /*------------------------ More Validations ------------------------*/
        optionsArrivalDate.onSelect = function (selected) {
          datepickerDepartureDate.datepicker("option", "minDate", selected);

          const closestDate = closestValidDate(arrDisabledDays, selected);
          console.warn(`closestDate`);
          console.log(closestDate);
          datepickerDepartureDate.datepicker("option", "maxDate", closestDate);

          // calcDateDiff();

          blockTimeForSameDates();
        }
        optionsDepartureDate.onSelect = function (selected) {
          datepickerArrivalDate.datepicker("option", "maxDate", selected);

          // calcDateDiff();

          blockTimeForSameDates();
        }
        /*------------------------ More Validations ------------------------*/

        //Re-initialise datepicker
        datepickerArrivalDate.datepicker(optionsArrivalDate);
        datepickerDepartureDate.datepicker(optionsDepartureDate);
      } else {
        console.warn('Datepicker: Restore back to original state');

        //Restore back to original options
        datepickerArrivalDate.datepicker(optionsArrivalDateCopy);
        datepickerDepartureDate.datepicker(optionsDepartureDateCopy);
      }
    }

    blockTimeForSameDates();
  }); //end of $(function ())

  function closestValidDate(dates, param) {
    let nearest = Infinity;
    let winner = -1;

    const target = new Date(param);

    dates.forEach(function (item, index) {
      const date = new Date(item);

      let distance = date - target;
      if (distance < nearest && distance > 0) {
        nearest = distance;
        winner = index;
      }
    })

    // return winner;
    // return dates[winner];

    if (winner == -1) {
      let date1 = new Date(param);
      return date1.addDays(maxStayDuration);
    }
    else {
      let date1 = new Date(param);
      let date2 = new Date(dates[winner]);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > maxStayDuration) {
        return date1.addDays(maxStayDuration);
      }
      else
        return dates[winner];
    }
  }

  function calcDateDiff() {
    let date1 = new Date(datepickerDepartureDate.val());
    let date2 = new Date(datepickerArrivalDate.val());
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // console.warn(diffDays + " days");

    if (diffDays > maxStayDuration) {
      $.toast({
        text: 'Date difference should be less than 6 days.',
        showHideTransition: 'fade',
        icon: 'error',
        textAlign: 'left',
        position: 'top-left'
      })
    }
  }

  Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
  }

  function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      var currentDateStr = $.datepicker.formatDate('dd-M-yy', currentDate);
      dateArray.push(currentDateStr)
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  }

  function blockTimeForSameDates() {
    $('select[name=input_58]').on("change", function () {
      if (datepickerArrivalDate.val() !== "" && datepickerDepartureDate.val() !== "") {
        if (datepickerArrivalDate.val() == datepickerDepartureDate.val()) {
          var theSelectedIndex = $(this)[0].selectedIndex;
          $.each($('select[name=input_60] option'), function () {
            $(this).removeAttr('disabled').prop('selected', true);
          });
          $.each($('select[name=input_60] option'), function () {
            var endOptionIndex = $(this).index();
            if (endOptionIndex < theSelectedIndex) {
              $(this).attr('disabled', 'disabled');
            } else {
              $(this).removeAttr('disabled').prop('selected', true);
              return false;
            }
          });
        } 
        else {
          // $.each($('select[name=input_58] option'), function () {
          //   $(this).removeAttr('disabled').prop('selected', true);
          // });
          $.each($('select[name=input_60] option'), function () {
            $(this).removeAttr('disabled').prop('selected', true);
          });
        }
      }
    });
  }
});
