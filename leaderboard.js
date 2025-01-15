// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const boardCont = document.querySelector(".boardCont");
const txt_cont = document.querySelector(".txt_cont");
let userName;

const firebaseConfig = {
    apiKey: "AIzaSyBv0jX7T6uKvqZNb7vkkkiUIF4oFp_zdWk",
    authDomain: "dovecoins-5e9ab.firebaseapp.com",
    projectId: "dovecoins-5e9ab",
    storageBucket: "dovecoins-5e9ab.firebasestorage.app",
    messagingSenderId: "329484039899",
    appId: "1:329484039899:web:b4c18856a6b6f42a69befe"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// *****
const db = getDatabase();

const renderLeaderBoard = (users) => {
  if (users.length > 0) {
    // console.log(users);
    let leaderboardHtml = users
      .map(
        (user, idx) =>
          `
    <li>
                <div class="dpcont">
                  <div class="dp">${user.username.charAt(0)}</div>
                  <h2>
                  ${user.username}
                    <span>${user.points} SP</span>
                  </h2>
                </div>
                <span>${idx + 1} </span>
              </li>
    `
      )
      .join("");
    boardCont.innerHTML = leaderboardHtml;
    // console.log(leaderboardHtml);
  } else {
    boardCont.innerHTML = `<li>
                <div class="dpcont">
                  <div class="dp">S</div>
                  <h2>
                    Nuel
                    <span>300 SP</span>
                  </h2>
                </div>
                2
              </li>`;
  }
};

window.addEventListener("load", (e) => {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
  const dbRef = ref(db);
  get(child(dbRef, "users"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const usersArray = Object.entries(userData).map(([key, value]) => ({
          username: key,
          ...value,
        }));
        // console.log(usersArray);
        const sortedUsers = usersArray.sort((a, b) => b.points - a.points);
        const topUsers = sortedUsers.slice(0,100);
        // console.log(sortedUsers);

        const userRank =
          topUsers.findIndex((user) => user.username === userName) + 1;
        // console.log(userRank);
        if (userRank > 0) {
          txt_cont.innerHTML = `
           <div class="dpcont">
            <div class="dp">
            ${topUsers[userRank - 1].username.charAt(0)}
            </div>
            <h2>
                 ${topUsers[userRank - 1].username}
              <span>    ${topUsers[userRank - 1].points} SP</span>
            </h2>
          </div>
          <span>#${userRank}</span>
          `;
        }
        renderLeaderBoard(topUsers);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
});