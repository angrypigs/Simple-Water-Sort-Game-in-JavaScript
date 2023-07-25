var Matrix = [];
for (var i=0;i<12;i++) {
    Matrix.push([0, 0, 0, 0]);
}

const Colors = [null, "#F7CE00", "#E55B00", "#D10000", "#B50069",
"#D300B7", "#6D00A0", "#00B515", "#237700", "#00CEC9", "#00A4E5"];
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const vialHeight = 0.25*windowHeight;
var current_vial = [0, 0, false];

function array_to_str(arr) {
    var arr0 = [];
    for (let i=0; i<arr.length; i++) {
        arr0.push(arr[i].join("-"));
    }
    return arr0.join("_");
}
function str_to_array(str) {
    var arr = [];
    var arr0 = str.split("_");
    for (let i=0; i<arr0.length; i++) {
        arr.push(arr0[i].split("-"));
        for (let j=0; j<4; j++) {
            arr[arr.length-1][j] = parseInt(arr[arr.length-1][j]);
        }
    }
    return arr;
}

function list_copy(arr) {
    var arr0 = [0, 0, 0, 0];
    for (var i=0;i<4;i++) {
        arr0[i] = arr[i];
    }
    return arr0;
}

function list_remove(arr, index) {
    var arr0 = [];
    for (var i=0;i<arr.length;i++) {
        if (i!==index) arr0.push(arr[i]);
    }
    return arr0;
}

function first_index(arr) {
    for (var i=arr.length-1;i>-1;i--) {
        if (arr[i]!=0) return i;
    }
    return -1;
}
function first_quantity(arr) {
    var k = first_index(arr);
    if (k == -1) return -1;
    else {
        var n = 0;
        for (var i=k;i>-1;i--) {
            if (arr[i]==arr[k]) {
                n += 1;
            }
            else if (arr[i]!=arr[k]) {
                break;
            }
        }
        return n;
    }
}
function reset_vials_storage() {
    for (let i=5; i>0; i--) {
        localStorage.removeItem("fioleczqi"+i);
    }
    localStorage.setItem("fioleczqi_current", array_to_str(Matrix));
    localStorage.setItem("fioleczqi_start", localStorage.getItem("fioleczqi_current"));
}

function actualize_vial(h, w) {
    for (let i=0;i<4;i++) {
        var s = document.getElementById("s"+h+"_"+w+"_"+i);
        if (Matrix[h*6+w][i]!=0) {
            if (s==null) {
                var ss = document.createElement("div");
                ss.id = "s"+h+"_"+w+"_"+i;
                ss.className = "substance";
                ss.style.bottom = vialHeight*i*0.22+"px";
                document.getElementsByClassName("fiolka"+h+"_"+w)[0].appendChild(ss);
            }
            document.getElementById("s"+h+"_"+w+"_"+i).style.backgroundColor = Colors[Matrix[h*6+w][i]];
        }
        else if (Matrix[h*6+w][i]==0 && s!==null) {
            document.getElementById("s"+h+"_"+w+"_"+i).remove();
        }
    }
}

function vial_mark(down_up, number) {
    if (down_up==0) {down_up=-1;}
    let s = document.getElementsByClassName("fiolka"+(Math.floor(number/6))+"_"+(number%6))[0];
    var counter = 0;
    var timer = setInterval(frame, 4);
    function frame() {
        s.style.top = (parseInt(s.style.top)+(4*down_up))+"px";
        counter += 1;
        if (counter==10) {clearInterval(timer);}
    }
}

function undo_game() {
    var m = parseInt(localStorage.getItem("uses_remaining"));
    console.log(m);
    if (localStorage.getItem("fioleczqi1")!==null && localStorage.getItem("fioleczqi1")!==undefined && m > 0) {
        m--; localStorage.setItem("uses_remaining", m+"");
        localStorage.setItem("fioleczqi_current", localStorage.getItem("fioleczqi1"));
        for (let i=1; i<5; i++) {
            if (localStorage.getItem("fioleczqi"+(i+1))!==null) {
                localStorage.setItem("fioleczqi"+i, localStorage.getItem("fioleczqi"+(i+1)));
            }
            else {localStorage.removeItem("fioleczqi"+i);}
        }
        Matrix = str_to_array(localStorage.getItem("fioleczqi_current"));
        for (let i=0; i<2; i++) {
            for (let j=0; j<6; j++) {
                actualize_vial(i, j);
            }
        }
        document.getElementById("back-btn-uses").innerText = m+"";
    }
}

function restart_game() {
    localStorage.setItem("uses_remaining", "5");
    if (current_vial[2]===true) {
        vial_mark(1, current_vial[0]*6+current_vial[1]);
        current_vial[2] = false;
    }
    Matrix = str_to_array(localStorage.getItem("fioleczqi_start"));
    for (let i=0; i<12; i++) {
        actualize_vial(Math.floor(i/6), i%6);
    }
    reset_vials_storage();
    document.getElementById("back-btn-uses").innerText = "5";
}

function mieszaj_vials() {
    localStorage.setItem("uses_remaining", "5");
    var Substances = [];
    current_vial[2] = false;
    for (let p=1; p<11; p++) {
        for (let j=0; j<4; j++) {
            Substances.push(p);
        }
    }
    for (let i=0;i<40;i++) {
        var k = Math.floor(Math.random()*Substances.length);
        Matrix[i%10][Math.floor(i/10)] = Substances[k];
        Substances = list_remove(Substances, k);
    }
    for (let i=10; i<12; i++) {
        for (let j=0; j<4; j++) {
            Matrix[i][j] = 0;
        }
    }
    for (let i=0;i<2;i++) {
        for (let j=0;j<6;j++) {
            actualize_vial(i, j);
        }
    }
    reset_vials_storage();
    let backg = document.getElementById("win-bg");
    if (backg!=null) {backg.remove();};
    document.getElementById("back-btn-uses").innerText = "5";
}

function win_check() {
    for (let i=0; i<12; i++) {
        var first = Matrix[i][0];
        for (let k=1; k<4; k++) {
            if (Matrix[i][k]!=first) {
                flaq=false; 
                return "t";
            }
        }
    }
    var win_bg = document.createElement("div");
    var win_btn = document.createElement("div");
    var win_btn_p = document.createElement("p");
    var win_btn_txt = document.createTextNode("Next level");
    win_bg.id = "win-bg";
    win_btn.id = "win-btn";
    win_btn_p.appendChild(win_btn_txt);
    win_btn.appendChild(win_btn_p);
    win_bg.appendChild(win_btn);
    document.body.appendChild(win_bg);
    document.getElementById("win-btn").addEventListener('click', function() {mieszaj_vials();}, false);
    return "f";
}


function vial_onclick(h, w) {
    if (current_vial[2]===false && first_index(Matrix[h*6+w]) != -1) {
        current_vial[2] = true;
        current_vial[0] = h;
        current_vial[1] = w;
        vial_mark(0, h*6+w);
    }
    else if (current_vial[2]===true) {
        current_vial[2] = false;
        var arr0 = list_copy(Matrix[current_vial[0]*6+current_vial[1]]);
        var arr1 = list_copy(Matrix[h*6+w]);
        var a = first_index(arr0); 
        var b = first_index(arr1);
        if (b == -1 || b != -1 && arr0[a]==arr1[b] && b<3) {
            var n = Math.min(first_quantity(arr0), 3-b);
            for (let i=0;i<4;i++) {
                if (Matrix[h*6+w][i]==0 && n!=0) {
                    Matrix[h*6+w][i]=arr0[a]; n--; 
                }
            }
            n = Math.min(first_quantity(arr0), 3-b);
            for (let i=3;i>-1;i--) {
                if (Matrix[current_vial[0]*6+current_vial[1]][i]==arr0[a] && n!=0) {
                    Matrix[current_vial[0]*6+current_vial[1]][i]=0; n--;
                }
            }
        actualize_vial(current_vial[0], current_vial[1]);
        actualize_vial(h, w);
        localStorage.setItem("czyZapisane", win_check());
        }
        vial_mark(1, current_vial[0]*6+current_vial[1]);
        
        for (let i=5; i>1; i--) {
            if (localStorage.getItem("fioleczqi"+(i-1))!==null) {
                localStorage.setItem("fioleczqi"+i, localStorage.getItem("fioleczqi"+(i-1)));
            }
        }
        localStorage.setItem("fioleczqi1", localStorage.getItem("fioleczqi_current"));
        localStorage.setItem("fioleczqi_current", array_to_str(Matrix));
    }
}

for (let i=0;i<2;i++) {
    for (let j=0;j<6;j++) {
        var fiolqa = document.createElement("div");
        fiolqa.className = "fioleczka "+"fiolka"+i+"_"+j;
        fiolqa.style.top = (windowHeight*(i*0.35+0.15))+"px";
        fiolqa.style.left = (windowWidth*(j*0.08+0.28))+"px";
        fiolqa.addEventListener('click', function() { vial_onclick(i, j); }, false);
        document.body.appendChild(fiolqa);
    }
}
document.getElementById("restart-btn").addEventListener('click', function() {restart_game();}, false);
document.getElementById("back-btn").addEventListener('click', function() {undo_game();}, false);

// localStorage.clear();
// localStorage.setItem("czyZapisane", "f");

if (localStorage.getItem("czyZapisane")===null || localStorage.getItem("czyZapisane") == "f") {
    mieszaj_vials();
    localStorage.setItem("czyZapisane", "t");
}
else {
    Matrix = str_to_array(localStorage.getItem("fioleczqi_current"));
    for (let i=0; i<2; i++) {
        for (let j=0; j<6; j++) {
            actualize_vial(i, j);
        }
    }
}
