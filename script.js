/* global Vue */

var app = new Vue({
    el: '#app',
    data: {
        playerX : null,
        playerO : null,
        winsX : 0,
        winsO : 0,
        colorX : null,
        colorO : null,
        winner : null,
        displayX : [ 'tl', 'tr', 'mc', 'bl', 'br' ],
        displayO : [ 'tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br' ],
        boardID: [ 'tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'],
        conversions: { // all rows, columns and diagonals sum to 15
            'tl' : 6, 'tc' : 7, 'tr' : 2, // 15
            'ml' : 1, 'mc' : 5, 'mr' : 9, // 15
            'bl' : 8, 'bc' : 3, 'br' : 4  // 15
    //  15        15        15        15  15
        },
        wonBoards: [],
        wonBoardsX: [],
        wonBoardsO: [],
        marks_X: {
            tl : [],
            tc : [],
            tr : [],
            ml : [],
            mc : [], 
            mr : [],
            bl : [],
            bc : [],
            br : [] 
        },
        marks_O: {
            tl : [],
            tc : [],
            tr : [],
            ml : [],
            mc : [],
            mr : [],
            bl : [],
            bc : [],
            br : []
        },
        toggle: true,
        displayRules: false,
        displayNameForms: false,
        playNext: '',
        currentPlay: '',
        error: null,
        alertMsg: null,
        changeType: null,
        btnConfirm: null,
        btnReject: null
    },
    methods: {
        mark(id) {
            let outer = id.substr(0, 2);
            let inner = id.substr(3, 2);
            if (this.winner == null) {
                if (outer == this.playNext || this.playNext == "") {
                    let grid = document.getElementById(id);
                    if (grid.innerHTML == "") {
                        grid.style.color = this.color();
                        grid.innerHTML = this.toggle ? "X" : "O";
                        
                        let obj = this.findBoard(outer);
                        obj.push(this.convert(inner));
                        let gameOver = false;
                        if(this.boardWon(obj)) { 
                            this.displayWin(outer); 
                            this.wonBoards.push(outer);
                            this.toggle ? this.wonBoardsX.push(this.convert(outer)) : this.wonBoardsO.push(this.convert(outer));
                            gameOver = this.toggle? this.boardWon(this.wonBoardsX) : this.boardWon(this.wonBoardsO);
                        }
                        if (!gameOver) { 
                            this.toggle = !this.toggle;
                            
                            this.playNext = inner;
                            this.wonBoards.forEach((ele) => {
                                if (this.playNext == ele) { this.playNext = ""; }
                            });
                            this.displayFocus(this.playNext, this.currentPlay);
                            this.currentPlay = this.playNext;
                        } else {
                            this.winner = this.toggle ? this.playerX ? this.playerX : "Player X" : this.playerO ? this.playerO : "Player O";
                            this.toggle ? this.winsX++ : this.winsO++;
                            this.displayFocus('', this.currentPlay);
                        }
                    } else {
                        this.error = "That spot is already taken!";
                        setTimeout(() => { 
                            document.getElementById(id).style.backgroundColor = "inherit"; 
                            this.error = null; 
                        }, 1800);
                    }
                } else {
                    this.error = "Play inside focus ring!";
                    document.getElementById(id).style.backgroundColor = "#ff6969";
                    setTimeout(() => { 
                        document.getElementById(id).style.backgroundColor = "inherit"; 
                        this.error = null; 
                    }, 1800);
                }
            } else {
                if (this.playerX) {
                    this.error = (this.winner == this.playerX) ? this.playerX : (this.playerO ? this.playerO : "Player O");
                } else {
                    this.error = (this.winner == "Player X") ? "Player X" : (this.playerO ? this.playerO : "Player O");
                }
                this.error += " won!" + " Click the button to play again!";
            }
        },
        findBoard(id) {
            switch (id) {
                case 'tl': return this.toggle ? this.marks_X.tl : this.marks_O.tl;
                case 'tc': return this.toggle ? this.marks_X.tc : this.marks_O.tc;
                case 'tr': return this.toggle ? this.marks_X.tr : this.marks_O.tr;
                case 'ml': return this.toggle ? this.marks_X.ml : this.marks_O.ml;
                case 'mc': return this.toggle ? this.marks_X.mc : this.marks_O.mc;
                case 'mr': return this.toggle ? this.marks_X.mr : this.marks_O.mr;
                case 'bl': return this.toggle ? this.marks_X.bl : this.marks_O.bl;
                case 'bc': return this.toggle ? this.marks_X.bc : this.marks_O.bc;
                case 'br': return this.toggle ? this.marks_X.br : this.marks_O.br;
            }
        },
        convert(id) {
            switch (id) {
                case 'tl': return this.conversions.tl;
                case 'tc': return this.conversions.tc;
                case 'tr': return this.conversions.tr;
                case 'ml': return this.conversions.ml;
                case 'mc': return this.conversions.mc;
                case 'mr': return this.conversions.mr;
                case 'bl': return this.conversions.bl;
                case 'bc': return this.conversions.bc;
                case 'br': return this.conversions.br;
            }
        },
        boardWon(board) {
            if (board.length >= 3) {
                for (let i = 0; i < board.length; i++) {
                    for (let j = (i + 1); j < board.length; j++) {
                        for (let k = (j + 1); k < board.length; k++) {
                            let sum = board[i] + board[j] + board[k];
                            if (sum == 15) { return true; }
                        }
                    }
                }
            }
            return false;
        },
        displayWin(outer) {
            if (this.toggle) {
                this.displayX.forEach((ele) => {
                    let id = outer + "_" + ele;
                    let grid = document.getElementById(id);
                    grid.style.backgroundColor = this.color();
                    grid.style.color = "black";
                });
            } else {
                this.displayO.forEach((ele) => {
                    let id = outer + "_" + ele;
                    let grid = document.getElementById(id);
                    grid.style.backgroundColor = this.color();
                    grid.style.color = "black";
                });
            }
        },
        displayFocus(nextID, currID) {
            document.getElementById(this.focusOut(currID)).style.border = "none";
            let next = document.getElementById(this.focusOut(nextID));
            next.style.border = "3px solid";
            next.style.borderColor = this.color();
            
        },
        focusOut(id) {
            switch (id) {
                case 'tl': return "tl_div";
                case 'tc': return "tc_div";
                case 'tr': return "tr_div";
                case 'ml': return "ml_div";
                case 'mc': return "mc_div";
                case 'mr': return "mr_div";
                case 'bl': return "bl_div";
                case 'bc': return "bc_div";
                case 'br': return "br_div";
                default: return "canvas";
            }
        },
        color() {
            switch (this.toggle ? this.colorX : this.colorO) {
                case 'blue': return '#7dfff8';
                case 'green': return '#87ffa5';
                case 'red': return '#ff7373';
                case 'orange': return '#ffbe5c';
                case 'yellow': return '#bd9700';
                case 'purple': return '#5260ff';
                case 'pink' : return '#ff73f6';
            }
        },
        toggleRules() { this.displayRules = !this.displayRules; },
        toggleNameForms() { this.displayNameForms = !this.displayNameForms; },
        assignColor(color) {
            if (this.toggle) { this.colorX = color; } 
            else { this.colorO = color; }
            document.getElementById(color).style.display = "none";
            this.toggle = !this.toggle;
        },
        clearScore() {
            this.winsO = 0;
            this.winsX = 0;
            this.error = "score cleared";
                setTimeout(() => { 
                    this.error = null; 
                }, 1500);
        },
        clearBoard() {
            this.winner = null;
            this.error = null;
            this.wonBoardsX = [];
            this.wonBoardsO = [];
            this.wonBoards = [];
            this. marks_X = {
                tl : [],
                tc : [],
                tr : [],
                ml : [],
                mc : [],
                mr : [],
                bl : [],
                bc : [],
                br : []
            };
            this.marks_O = {
                tl : [],
                tc : [],
                tr : [],
                ml : [],
                mc : [],
                mr : [],
                bl : [],
                bc : [],
                br : []
            };
            this.clearMarks();
            this.playNext = '';
            this.toggle = true;
            this.displayFocus(this.playNext, this.currentPlay);
            this.currentPlay = '';
            
            this.error = "board cleared";
            setTimeout(() => { 
                this.error = null; 
            }, 1500);
        },
        clearMarks() {
            this.boardID.forEach((id_out) => {
                this.boardID.forEach((id_in) => {
                    let id = id_out + "_" + id_in;
                    let grid = document.getElementById(id);
                    grid.style.backgroundColor = "inherit";
                    grid.style.color = "inherit";
                    grid.innerHTML = "";
                });
            });
        },
        pickColors() {
            if (!(this.colorX == null && this.colorO == null)) {
                this.colorX = null;
                this.colorO = null;
            } else { 
                this.error = "no colors selected";
                setTimeout(() => { 
                    this.error = null; 
                }, 1500);
            }
        },
        playAgain(colors) {
            if (colors) { this.pickColors(); } 
            this.clearBoard();
        },
        displayAlert(msg) { this.alertMsg = msg; },
        hideAlert() { this.alertMsg = null; },
        change(item) {
            this.changeType = item;
            this.winner = null;
            if (item == "color" || item == "board") {
                this.btnConfirm = "yes";
                this.btnReject = "no";
                this.alertMsg = "Your game will be cleared. Are you sure you want to continue?";
            }
            if (item == "again") {
                this.btnConfirm = "yes";
                this.btnReject = "no";
                this.alertMsg = "Would you like to change colors?";
            }
        },
        confirm() {
            switch(this.changeType) {
                case "color": this.pickColors();
                case "board": this.clearBoard(); break;
                case "again": this.playAgain(true); break;
                default: break;
            }
            this.changeType = null;
            this.reject();
        },
        reject() {
            if (this.changeType == "again") { this.playAgain(false); }
            
            this.alertMsg = null;
            this.btnConfirm = null;
            this.btnReject = null;
            this.changeType = null;
        }
    },
});
