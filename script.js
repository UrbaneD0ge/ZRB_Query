const Zquery = document.getElementById("Zquery");

Zquery.oninput = (e) => {
  e.target.value = patternMatch({
    input: e.target.value,
    template: "Z-xx-xxx",
  });
};

function patternMatch({
  input,
  template
}) {
  try {


    let j = 0;
    let plaintext = "";
    let countj = 0;
    while (j < template.length) {
      // code block to be

      if (countj > input.length - 1) {
        template = template.substring(0, j);
        break;
      }

      if (template[j] == input[j]) {
        j++;
        countj++;
        continue;
      }

      if (template[j] == "x") {
        template = template.substring(0, j) + input[countj] + template.substring(j + 1);
        plaintext = plaintext + input[countj];
        countj++;
      }
      j++;
    }

    return template

  } catch {
    return ""
  }
};

function zMatch() {
  let Zquery = document.getElementById('Zquery').value;
  zGroup = Zquery.match(/^([Z]{1})\-([\d]{2})\-([\d]{1,3})$/)
  let zPadded = [
    zGroup[1],
    zGroup[2],
    zGroup[3].padStart(3, '0')].join('-');
  console.log(zPadded);
  return zPadded;
};

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  // const form = document.getElementById('form');
  let Zquery = document.getElementById('Zquery').value;
  let status = document.getElementById('status');
  let decision = document.getElementById('decision');
  let link = document.getElementById('link');
  let Zstatus = '';
  let ordLink = '';
  let zPadded = zMatch(Zquery);
  status.innerText = `Fetching ${zPadded}`;
  // let decisionSpace = '';
  await fetch(`https://gis.atlantaga.gov/dpcd/rest/services/LandUsePlanning/LandUsePlanning/MapServer/10/query?where=DOCKET_NO%3D'${zPadded}'&outFields=ORDHYPERLINK,%20STATUSTYPE&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&returnExtentOnly=false&f=pjson`)

    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.features[0] === undefined) {
        document.getElementById('status').innerText = 'No Data';
        return;
      }
      console.log(data.features[0].attributes);
      if (data.features[0].attributes.ORDHYPERLINK)
        ordLink = data.features[0].attributes.ORDHYPERLINK || 'No Data';
      Zstatus = data.features[0].attributes.STATUSTYPE;
      return { ordLink, Zstatus }
    })
    .catch((err) => {
      document.getElementById('status').innerText = 'Could not Fetch';
      console.log(err);
    });

  switch (Zstatus) {
    case 'Complete':
      status.innerText = Zstatus;
      status.style.color = 'green';
      decision.innerText = 'ZRB - Approval';
      copyDecision();
      // saveData();
      break;
    case 'Correction':
      status.innerText = Zstatus;
      status.style.color = 'blue';
      decision.innerText = '-';
      break;
    case 'Denied':
      status.innerText = Zstatus;
      status.style.color = 'red';
      decision.innerText = 'ZRB - Denial';
      copyDecision();
      // saveData();
      break;
    case 'Filed':
      status.innerText = Zstatus;
      status.style.color = 'purple';
      decision.innerText = 'Filed';
      copyDecision();
      // saveData();
      break;
    case 'Pending':
      status.innerText = Zstatus;
      status.style.color = 'orange';
      decision.innerText = '-';

      // saveData();
      break;
    case 'Reserved':
      status.innerText = Zstatus;
      status.style.color = 'brown';
      decision.innerText = 'Reserved';
      copyDecision();
      break;
    default:
      status.innerText = Zstatus || 'No Data';
      status.style.color = 'black';
      link.innerText = 'No Data';
      decision.innerText = '-';
      break;
  }

  if (ordLink !== 'No Data') {
    link.innerText = zPadded;
    link.setAttribute('href', ordLink);
    link.setAttribute('target', '_blank');
  } else {
    link.innerText = 'No Data';
    link.removeAttribute = 'href';
  }

  saveData(zPadded, Zstatus, decision.innerText, ordLink);
  // clear form
  form.reset();
  // clear variables
  Zquery = '';
  ordLink = '';
  Zstatus = '';
});

let table = document.getElementById('table');
let tableData = JSON.parse(localStorage.getItem('tableData')) || [];

function saveData(ordLink) {
  let Zquery = document.getElementById('Zquery').value;
  let status = document.getElementById('status').innerText;
  let decision = document.getElementById('decision').innerText;
  let link = ordLink;
  let data = {
    Zquery,
    status,
    decision,
    link
  };
  tableData.push(data);
  sessionStorage.setItem('tableData', JSON.stringify(tableData));
  tableData.forEach((data) => {
    let row = document.createElement('tr');
    table.appendChild(row);
    row.innerHTML = `
      <td><a href='${data.link} target="_blank" rel="noreferrer">${data.zPadded}</a></td>
      <td>${data.status}</td>
      <td>${data.decision}</td>
      <td>${data.link}</td>
    `;
    // renderTable();
  });
};

// copy decision to clipboard
function copyDecision() {
  let decision = document.getElementById('decision');
  let range = document.createRange();
  range.selectNode(decision);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  navigator.clipboard.writeText(decision.innerText);
  window.getSelection().removeAllRanges();
  console.log(`${Zquery}: '${decision.innerText}' copied to clipboard`);
};