$(document).ready(function () {
  var datepickerArrivalDate = $('#input_57_5');
  var datepickerDepartureDate = $('#input_57_4');
  var dropdownPurposeOfVisit = $('#input_57_1');

  var disabledDays = [];
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
      startdate: '10-Oct-2024',
      enddate: '15-Oct-2024',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 1,
      name: 'Individual Retreat',
      label: 'Individual Retreat',
      startdate: '25-Oct-2024',
      enddate: '30-Oct-2024',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '12-Oct-2024',
      enddate: '13-Oct-2024',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '19-Oct-2024',
      enddate: '20-Oct-2024',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 2,
      name: 'Long Meditation',
      label: 'Long Meditation',
      startdate: '26-Oct-2024',
      enddate: '27-Oct-2024',
      status: true,
    },
    {
      centerid: 36,
      centername: "Ranchi",
      purpose_id: 3,
      name: 'Conducted Retreat',
      label: 'Conducted Retreat',
      startdate: '25-Oct-2024',
      enddate: '27-Oct-2024',
      status: true,
    },

    {
      enterid: 36,
      centername: "Ranchi",
      purpose_id: 4,
      name: 'Other',
      label: 'Other',
      startdate: '29-Oct-2024',
      enddate: '31-Oct-2024',
      status: false,
    }
  ];

  $(function () {
    datepickerArrivalDate.datepicker({
      inline: true,
      altField: '#input_57_5_text',
      dateFormat: 'dd-M-yy'
    });
    datepickerDepartureDate.datepicker({
      inline: true,
      altField: '#input_57_4_text',
      dateFormat: 'dd-M-yy'
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

        mergedArray.forEach(function (item) {
          disabledDays += getDates(new Date(item.startdate), new Date(item.enddate));
        });

        console.warn(`disabledDays`);
        console.log(disabledDays);

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
        // optionsArrivalDate.onSelect = function (selected) {
        //   datepickerDepartureDate.datepicker("option", "minDate", selected);

        //   calcDateDiff();
        // }
        // optionsDepartureDate.onSelect = function (selected) {
        //   datepickerArrivalDate.datepicker("option", "maxDate", selected);

        //   calcDateDiff();
        // }
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
  });

  function calcDateDiff() {
    let date1 = new Date(datepickerDepartureDate.val());
    let date2 = new Date(datepickerArrivalDate.val());
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    console.warn(diffDays + " days");

    if (diffDays > 6) {
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
});
