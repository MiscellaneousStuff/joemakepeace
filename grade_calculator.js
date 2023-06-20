window.addEventListener("DOMContentLoaded", loadMarksFromLocalStorage);

function calculateGrade(weightedMean) {
    if (weightedMean >= 70) {
        return "Distinction";
    } else if (weightedMean >= 60) {
        return "Merit";
    } else if (weightedMean >= 40) {
        return "Pass";
    } else {
        return "Fail";
    }
}

const discountedMean = (marks, credits) => {
    let lowestMark = 101;
    let lowestCredit = 101;

    let weightedSum = 0;
    let creditSum = 0;
    
    for (let i=0; i<marks.length; i++) {
        const mark   = marks[i];
        const credit = credits[i];

        weightedSum += (mark / 100) * credit;
        creditSum += credit;

        if (mark < lowestMark && credit <= 20) {
            lowestMark = mark;
            lowestCredit = credit;
        }
    }

    console.log("weightedSum, creditSum:", weightedSum, creditSum, weightedSum/creditSum)
    if (!(lowestMark == 101 && lowestCredit == 101)) {
        creditSum -= lowestCredit;
        weightedSum -= (lowestMark / 100) * lowestCredit;
    }
    console.log("weightedSum, creditSum:", weightedSum, creditSum, weightedSum/creditSum)

    return weightedSum / creditSum;
};

function calculateGrades() {
    const getMarks = (id, cls) => Array.from(document.querySelector(`#${id}`).querySelectorAll(`.${cls}`))
        .map(input => Number(input.value));
    const getCredits = (id, cls) => Array.from(document.querySelector(`#${id}`).querySelectorAll(`.${cls}`))
        .map(input => Number(input.placeholder));

    const level5Marks = getMarks('level5', "mark");
    const level5Credits = getCredits('level5', "credit");
    const level6Marks = getMarks('level6', "mark");
    const level6Credits = getCredits('level6', "credit");
    const level7Marks = getMarks('level7', "mark");
    const level7Credits = getCredits('level7', "credit");
    
    console.log("lvl5")
    const level5DiscountedMean = discountedMean(level5Marks, level5Credits);
    console.log("lvl6")
    const level6DiscountedMean = discountedMean(level6Marks, level6Credits);
    console.log("lvl7")
    const level7DiscountedMean = discountedMean(level7Marks, level7Credits);

    console.log("level5DiscountedMean, level6DiscountedMean, level7DiscountedMean:", level5DiscountedMean, level6DiscountedMean, level7DiscountedMean);
    const weightedMean5050 = (level6DiscountedMean * 0.5 + level7DiscountedMean * 0.5) * 100;
    const weightedMean204040 = (level5DiscountedMean * 0.2 + level6DiscountedMean * 0.4 + level7DiscountedMean * 0.4) * 100;
    const finalGrade5050 = calculateGrade(weightedMean5050);
    const finalGrade204040 = calculateGrade(weightedMean204040);

    document.getElementById('finalGrade').innerHTML = `
        Final Grade (50:50 weighting): ${finalGrade5050}, ${weightedMean5050.toFixed(2)}%<br/>
        Final Grade (20:40:40 weighting): ${finalGrade204040}, ${weightedMean204040.toFixed(2)}%
    `;
}

function saveMarksToLocalStorage() {
    var level5Inputs = document.querySelectorAll("#level5 .mark");
    var level6Inputs = document.querySelectorAll("#level6 .mark");
    var level7Inputs = document.querySelectorAll("#level7 .mark");
  
    var marks = {};
  
    for (var i = 0; i < level5Inputs.length; i++) {
      var moduleName = level5Inputs[i].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
      var mark = level5Inputs[i].value;
      marks["level5_" + moduleName] = mark;
    }
  
    for (var j = 0; j < level6Inputs.length; j++) {
      var moduleName = level6Inputs[j].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
      var mark = level6Inputs[j].value;
      marks["level6_" + moduleName] = mark;
    }

    for (var j = 0; j < level7Inputs.length; j++) {
        var moduleName = level7Inputs[j].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
        var mark = level7Inputs[j].value;
        marks["level7_" + moduleName] = mark;
      }
  
    localStorage.setItem("marks", JSON.stringify(marks));
  }
  

//   function loadMarksFromLocalStorage() {
//     // Get the marks object from local storage
//     var marks = JSON.parse(localStorage.getItem("marks"));
    
//     // Check if marks exist in local storage
//     if (marks) {
//       // Loop through each mark input and set its value based on the corresponding saved mark
//       var markInputs = document.getElementsByClassName("mark");
//       for (var i = 0; i < markInputs.length; i++) {
//         var moduleName = markInputs[i].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
//         if (marks.hasOwnProperty(moduleName)) {
//           markInputs[i].value = marks[moduleName];
//         }
//       }
//     }
//   }

function loadMarksFromLocalStorage() {
    var marks = JSON.parse(localStorage.getItem("marks"));
  
    if (marks) {
      var level5Inputs = document.querySelectorAll("#level5 .mark");
      var level6Inputs = document.querySelectorAll("#level6 .mark");
      var level7Inputs = document.querySelectorAll("#level7 .mark");
  
      for (var i = 0; i < level5Inputs.length; i++) {
        var moduleName = level5Inputs[i].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
        var key = "level5_" + moduleName;
        if (marks.hasOwnProperty(key)) {
          level5Inputs[i].value = marks[key];
        }
      }
  
      for (var j = 0; j < level6Inputs.length; j++) {
        var moduleName = level6Inputs[j].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
        var key = "level6_" + moduleName;
        if (marks.hasOwnProperty(key)) {
          level6Inputs[j].value = marks[key];
        }
      }

      for (var j = 0; j < level7Inputs.length; j++) {
        var moduleName = level7Inputs[j].parentNode.previousElementSibling.firstChild.getAttribute("placeholder");
        var key = "level7_" + moduleName;
        if (marks.hasOwnProperty(key)) {
          level7Inputs[j].value = marks[key];
        }
      }
    }
  }
  

  function clearSavedMarks() {
    // Clear the marks object from local storage
    localStorage.removeItem("marks");
  
    // Reset the input fields by setting their values to an empty string
    var markInputs = document.getElementsByClassName("mark");
    for (var i = 0; i < markInputs.length; i++) {
      markInputs[i].value = "";
    }
  }