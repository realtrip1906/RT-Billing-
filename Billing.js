const url = "https://script.google.com/macros/s/AKfycbzDYq0h5IThWxPGn4axnkjoYzEa4xR4a5xgPy3jdW0_l7ess-ChQiLft07s5DV6CHQENQ/exec";

// new data entry button
const newEntry = document.getElementById("newEntry");
newEntry.addEventListener("click", function () {
  let bookingDetails = document.getElementById("bookingDetails");
  bookingDetails.style.display = "block";
  document.getElementById("utilityButtons").style.display = "none";
  document.getElementById("billingForm").reset();
  let saveButton = document.getElementById("save");
  let updateButton = document.getElementById("update");
  saveButton.style.display = "block";
  updateButton.style.display = "none";
  document.getElementById("bookingIdHeading").style.display = "none";
  //document.getElementById("navButtons").style.display = "none";
  document.getElementById("resetButton").style.display = "block";
});

// close display panel button
const closeButton = document.getElementById("close");
closeButton.addEventListener("click", function () {
  let x = document.getElementById("bookingDetails");
  x.style.display = "none";
  document.getElementById("navButtons").style.display = "flex";
});

// search button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
  let searchBookingId = document.getElementById("searchBooking");
  displayBookingDetails(searchBookingId.value);
});

// close notification div
const notificationClose = document.getElementById("notificationClose");
notificationClose.addEventListener("click", function () {
  let notificationDiv = document.getElementById("notification");
  notificationDiv.style.display = "none";
});

// update a specific entry
let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function (event) {
  let bookingId = document
    .getElementById("bookingIdHeading")
    .textContent.substring(13);
  event.preventDefault();
  if (billingForm.checkValidity()) {
    //console.log("updating : " + bookingId);
    submitBillingData(url + `?update=true&BookingId=${bookingId}`, bookingId);
  }
  billingForm.classList.add("was-validated");
});

let completedButton = document.getElementById("completed");
completedButton.addEventListener("click", function () {
  displayData(responseJson, "completed");
});

let ongoingButton = document.getElementById("ongoing");
ongoingButton.addEventListener("click", function () {
  displayData(responseJson, "ongoing");
});

let upcomingButton = document.getElementById("upcoming");
upcomingButton.addEventListener("click", function () {
  displayData(responseJson, "upcoming");
});

let allButton = document.getElementById("all");
allButton.addEventListener("click", function () {
  displayData(responseJson, "all");
});

// filter by date
let endDate = document.getElementById("endDate");
endDate.addEventListener("change", function () {
  let startDateValue = new Date(document.getElementById("startDate").value);
  let endDateValue = new Date(document.getElementById("endDate").value);

  console.log("start: " + startDateValue);
  console.log("end: " + endDateValue);
  let filteredResponseJson = [];
  responseJson.forEach((element) => {
    let tripStartDate = new Date(element.TripStartDate);
    let tripEndDate = new Date(element.TripEndDate);
    tripEndDate = tripEndDate.setDate(tripEndDate.getDate() + 1);
    tripEndDate = new Date(tripEndDate);
    if (
      tripEndDate.setDate(tripEndDate.getDate() + 1) >= startDateValue &&
      tripStartDate <= endDateValue &&
      element.BookingStatus != "BookingCancelled"
    ) {
      filteredResponseJson.push(element);
    }
  });

  displayData(filteredResponseJson, "all");
});

//get all booking data
let responseJson = null;
async function readBillingData() {
  const response = await fetch(url);
  responseJson = await response.json();
  displayData(responseJson, "all");
}

function enableNavButtons() {
  document.getElementById("completed").disabled = false;
  document.getElementById("ongoing").disabled = false;
  document.getElementById("upcoming").disabled = false;
  document.getElementById("all").disabled = false;
  document.getElementById("startDate").disabled = false;
  document.getElementById("endDate").disabled = false;
}

// display all booking details
function displayData(responseJson, bookingStatus) {
  responseJson.sort(
    (a, b) => new Date(a.TripStartDate) - new Date(b.TripStartDate)
  );
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  let displayJson = [];

  if (bookingStatus == "all") {
    displayJson = responseJson;
  } else if (bookingStatus == "completed") {
    responseJson.forEach((element) => {
      let tripendDate = new Date(element.TripEndDate).getTime();

      //let tripStartDate = new Date(element.TripStartDate).getTime();
      let currentDate = new Date().getTime();
      //if(tripendDate<currentDate) {
      if (
        tripendDate < currentDate &&
        element.BookingStatus != "BookingCancelled"
      ) {
        displayJson.push(element);
      }
    });
  } else if (bookingStatus == "ongoing") {
    responseJson.forEach((element) => {
      let tripStartDate = new Date(element.TripStartDate);
      let currentDate = new Date();
      let tripEndDate = new Date(element.TripEndDate);
      tripEndDate.setDate(tripEndDate.getDate() + 1);
      //if (tripStartDate < currentDate && tripendDate >= currentDate) {
      if (
        tripStartDate < currentDate &&
        tripEndDate >= currentDate &&
        element.BookingStatus != "BookingCancelled"
      ) {
        displayJson.push(element);
      }
    });
  } else if (bookingStatus == "upcoming") {
    responseJson.forEach((element) => {
      //let tripendDate = new Date(element.TripEndDate).getTime();
      let tripStartDate = new Date(element.TripStartDate).getTime();
      let currentDate = new Date().getTime();
      //if (tripStartDate > currentDate) {
      if (
        tripStartDate > currentDate &&
        element.BookingStatus != "BookingCancelled"
      ) {
        displayJson.push(element);
      }
    });
  }
  //console.log(displayJson);
  displayJson.forEach((element) => {
    let tableRow = document.createElement("tr");
    let tableHeading = document.createElement("th");
    tableHeading.scope = "row";

    let bookingIdLink = document.createElement("a");
    bookingIdLink.href = "#";
    bookingIdLink.onclick = function () {
      displayBookingDetails(element.BookingId);
    };
    bookingIdLink.textContent = element.BookingId;
    tableHeading.appendChild(bookingIdLink);

    //tableHeading.textContent = element.BookingId;
    let guestName = document.createElement("td");
    guestName.textContent = element.GuestName;
    let startDate = document.createElement("td");
    startDate.textContent = new Date(
      element.TripStartDate
    ).toLocaleDateString();
    let endDate = document.createElement("td");
    endDate.textContent = new Date(element.TripEndDate).toLocaleDateString();
    let bookingStatus = document.createElement("td");
    bookingStatus.textContent = element.BookingStatus;
    if (bookingStatus.textContent === "AllComplete") {
      bookingStatus.style.color = "green";
    } else {
      bookingStatus.style.color = "red";
    }
    tableRow.appendChild(tableHeading);
    tableRow.appendChild(guestName);
    tableRow.appendChild(startDate);
    tableRow.appendChild(endDate);
    tableRow.appendChild(bookingStatus);
    tableBody.appendChild(tableRow);
  });
}

// display particular booking data
function displayBookingDetails(bookingId) {
  let dataFound = false;
  let data = null;
  //console.log(bookingId);
  responseJson.forEach((element) => {
    if (element.BookingId == bookingId) {
      data = element;
      dataFound = true;
      return;
    }
  });
  if (dataFound) {
    let x = document.getElementById("bookingDetails");
    x.style.display = "block";

    document.getElementById("bookingIdHeading").style.display = "block";
    document.getElementById("bookingIdHeading").textContent =
      "Booking Id : " + bookingId;
    document.getElementById("guestName").value = data.GuestName;
    document.getElementById("guestNumber").value = data.GuestNumber;
    document.getElementById("guestEmail").value = data.GuestEmail;
    document.getElementById("tripDescription").value = data.TripDescription;
    document.getElementById("accommodationType").value = data.AccommodationType;
    document.getElementById("adultCount").value = data.AdultCount;
    document.getElementById("childCount").value = data.ChildCount;
    document.getElementById("roomCount").value = data.RoomCount;
    document.getElementById("mealPlan").value = data.MealPlan;
    document.getElementById("cabType").value = data.CabType;
    document.getElementById("bookingDate").value = formatDate(data.BookingDate);
    document.getElementById("tripStartDate").value = formatDate(
      data.TripStartDate
    );
    document.getElementById("tripEndDate").value = formatDate(data.TripEndDate);
    document.getElementById("guestTotalCost").value = data.GuestTotalCost;
    document.getElementById("guestAdvance").value = data.GuestAdvance;
    document.getElementById("hotelName").value = data.HotelName;
    document.getElementById("hotelTotalCost").value = data.HotelTotalCost;
    document.getElementById("hotelAdvance").value = data.HotelAdvance;
    document.getElementById("cabVendor").value = data.CabVendor;
    document.getElementById("cabTotalCost").value = data.CabTotalCost;
    document.getElementById("cabAdvance").value = data.CabAdvance;
    document.getElementById("bookinStatus").value = data.BookingStatus;
    document.getElementById("comments").value = data.Comments;
    let saveButton = document.getElementById("save");
    let updateButton = document.getElementById("update");
    let resetButton = document.getElementById("resetButton");
    saveButton.style.display = "none";
    updateButton.style.display = "block";
    resetButton.style.display = "none";
    document.getElementById("utilityButtons").style.display = "flex";
    let pdfView = document.getElementById("pdfView");
    pdfView.onclick = function () {
      modal = document.getElementById("pdfPreview");
      modal.style.display = "block";
      displayPdfPreview(data);
    };
  } else {
    displayNotification("No Booking found for given Id ! ", "failure");
  }
}

modal = document.getElementById("pdfPreview");
let span = document.getElementsByClassName("close")[0];
let pdfCloseButton = document.getElementById("closePdfViewer");
span.onclick = function () {
  modal.style.display = "none";
};
pdfCloseButton.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function displayPdfPreview(currentData) {
  //let pdfPreviewDiv = document.getElementById("pdfPreviewDiv");
  document.getElementById("pdfBookingId").innerText =
    "Booking ID : " + currentData.BookingId;
  document.getElementById("pdfGuestName").innerText = currentData.GuestName;
  document.getElementById("pdfGuestNumber").innerText = currentData.GuestNumber;
  document.getElementById("pdfAdultCount").innerText = currentData.AdultCount;
  document.getElementById("pdfChildCount").innerText = currentData.ChildCount;
  document.getElementById("pdfRoomCount").innerText = currentData.RoomCount;
  document.getElementById("pdfAccommodationType").innerText =
    currentData.AccommodationType;
  document.getElementById("pdfMealPlan").innerText = currentData.MealPlan;
  document.getElementById("pdfCabType").innerText = currentData.CabType;
  document.getElementById("pdfTripStartDate").innerText = formatDatePDF(
    currentData.TripStartDate
  );
  document.getElementById("pdfTripEndDate").innerText = formatDatePDF(
    currentData.TripEndDate
  );
  document.getElementById("pdfGuestTotalCost").innerText =
    currentData.GuestTotalCost;
  document.getElementById("pdfGuestAdvance").innerText =
    currentData.GuestAdvance;
  document.getElementById("pdfTripDescription").innerText =
    currentData.TripDescription;

  let generatePdf = document.getElementById("generatePdf");
  generatePdf.onclick = function () {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF("p", "px", [1240, 1540]);
    let pdfjs = document.querySelector("#pdfPreviewDiv");

    doc.html(pdfjs, {
      margin: [40, 0, 40, 0],
      autoPaging: "text",
      html2canvas: {
        allowTaint: true,
        letterRendering: true,
        logging: false,
        scale: 1, // Adjust the scale to fit content
      },
      callback: function (doc) {
        doc.save(currentData.BookingId + ".pdf");
      },
      x: 12,
      y: 10,
    });
  };
}

// form validation check before saving
const billingForm = document.getElementById("billingForm");
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function (event) {
  const customValidation = validateFormEntries();
  if (!customValidation || !billingForm.checkValidity()) {
    //console.log("validation-if");
    event.preventDefault();
    event.stopPropagation();
  } else {
    const currentDate = new Date();
    const bookingId = "RT" + currentDate.getTime().toString();
    //console.log("Submitting form");
    submitBillingData(url, bookingId);
  }
  billingForm.classList.add("was-validated");
});

function validateFormEntries() {
  const tripStartDate = document.getElementById("tripStartDate").value;
  const tripEndDate = document.getElementById("tripEndDate").value;
  let startDate = new Date(tripStartDate).getTime();
  let endDate = new Date(tripEndDate).getTime();

  if (startDate > endDate) {
    document.getElementById("tripStartDate").classList.add("is-invalid");
    document.getElementById("tripStartDate").focus();
    document.getElementById("tripEndDate").classList.add("is-invalid");
    return false;
  } else {
    document.getElementById("tripStartDate").classList.remove("is-invalid");
    document.getElementById("tripEndDate").classList.remove("is-invalid");
  }
  return true;
}

// save form data
function submitBillingData(url, bookingId) {
  const guestName = document.getElementById("guestName").value;
  const guestNumber = document.getElementById("guestNumber").value;
  const guestEmail = document.getElementById("guestEmail").value;
  const tripDescription = document.getElementById("tripDescription").value;
  const accommodationType = document.getElementById("accommodationType").value;
  const adultCount = document.getElementById("adultCount").value;
  const childCount = document.getElementById("childCount").value;
  const roomCount = document.getElementById("roomCount").value;
  const mealPlan = document.getElementById("mealPlan").value;
  const cabType = document.getElementById("cabType").value;
  const bookingDate = document.getElementById("bookingDate").value;
  const tripStartDate = document.getElementById("tripStartDate").value;
  const tripEndDate = document.getElementById("tripEndDate").value;
  const guestTotalCost = document.getElementById("guestTotalCost").value;
  const guestAdvance = document.getElementById("guestAdvance").value;
  const hotelName = document.getElementById("hotelName").value;
  const hotelTotalCost = document.getElementById("hotelTotalCost").value;
  const hotelAdvance = document.getElementById("hotelAdvance").value;
  const cabVendor = document.getElementById("cabVendor").value;
  const cabTotalCost = document.getElementById("cabTotalCost").value;
  const cabAdvance = document.getElementById("cabAdvance").value;
  const bookinStatus = document.getElementById("bookinStatus").value;
  const comments = document.getElementById("comments").value;

  let obj = {
    BookingId: bookingId,
    GuestName: guestName,
    GuestNumber: guestNumber,
    GuestEmail: guestEmail,
    TripDescription: tripDescription,
    AccommodationType: accommodationType,
    AdultCount: adultCount,
    ChildCount: childCount,
    RoomCount: roomCount,
    MealPlan: mealPlan,
    CabType: cabType,
    BookingDate: bookingDate,
    TripStartDate: tripStartDate,
    TripEndDate: tripEndDate,
    GuestTotalCost: guestTotalCost,
    GuestAdvance: guestAdvance,
    HotelName: hotelName,
    HotelTotalCost: hotelTotalCost,
    HotelAdvance: hotelAdvance,
    CabVendor: cabVendor,
    CabTotalCost: cabTotalCost,
    CabAdvance: cabAdvance,
    BookinStatus: bookinStatus,
    Comments: comments,
  };
  //console.log("URL : " + url);
  fetch(url, {
    redirect: "follow",
    method: "POST",
    //mode: 'cors',
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
    .then(readBillingData)
    .then(closeNewEntry);
}

function closeNewEntry() {
  displayNotification("Data saved successfully ! ", "success");
  let bookingDetails = document.getElementById("bookingDetails");
  bookingDetails.style.display = "none";
}

// display success/ failure notification
function displayNotification(message, status) {
  if (status == "failure") {
    let notificationDiv = document.getElementById("notification");
    notificationDiv.style.backgroundColor = "red";
    notificationDiv.style.display = "flex";
    document.getElementById("notoficationMessage").innerText = message;
  } else {
    let notificationDiv = document.getElementById("notification");
    notificationDiv.style.backgroundColor = "green";
    notificationDiv.style.display = "flex";
    document.getElementById("notoficationMessage").innerText = message;
  }
}

// format date to dd-mm-yyyy before setting in date input
function formatDate(anyDate) {
  let d = new Date(anyDate);
  let year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString().padStart(2, 0);
  let date = d.getDate().toString().padStart(2, 0);
  let formattedDate = year + "-" + month + "-" + date;
  return formattedDate;
}

function formatDatePDF(anyDate) {
  let d = new Date(anyDate);
  let year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString().padStart(2, 0);
  let date = d.getDate().toString().padStart(2, 0);
  let formattedDate = date + "-" + month + "-" + year;
  return formattedDate;
}

// get all booking details while page loads
readBillingData().then(enableNavButtons);
