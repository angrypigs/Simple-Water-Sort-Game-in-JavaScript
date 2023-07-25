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

function saving_vials(save_unload) {
    switch (save_unload) {
        case 0:
            for (let i=0; i<12; i++) {
                for (let k=0; k<4; k++) {
                    localStorage.setItem("fiolqeczqi"+i+"_"+k, Matrix[i][k]+"");
                }
            }
            break;
        case 1:
            for (let i=0; i<12; i++) {
                for (let k=0; k<4; k++) {
                    Matrix[i][k] = parseInt(localStorage.getItem("fiolqeczqi"+i+"_"+k));
                }
            }
            break;
    }
}

function update_vial(h, w) {
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
function move_up_vial(number, down_up) {
    var i = 0;
    while (i < 10) {
        var s = document.getElementsByClassName("fiolka"+(Math.floor(number/6))+"_"+(number%6))[0];
        var h_vial = getComputedStyle(s).top;
        s.style.top = h_vial+(5*down_up);
        i += 1;
    }
}

function vial_border(remove_add, number) {
    switch (remove_add) {     
        case 0:
            for (let i=0; i<2; i++) {
                for (let j=0; j<6; j++) {
                    let s = document.getElementsByClassName("fiolka"+i+"_"+j)[0];
                    s.style.border = "3px solid whitesmoke";
                    s.style.borderTop = "0px solid";
                    
                }
            }
            break;
        case 1:
            s = document.getElementsByClassName("fiolka"+(Math.floor(number/6))+"_"+(number%6))[0];
            s.style.border = "3px solid #FBF179";
            s.style.borderTop = "0px";
            break;
    }
}

function list_remove(arr, index) {
    var arr0 = [];
    for (var i=0;i<arr.length;i++) {
        if (i!==index) arr0.push(arr[i]);
    }
    return arr0;
}


function mix_vials() {
    var Substances = [];
    for (var p=1; p<11; p++) {
        for (var j=0; j<4; j++) {
            Substances.push(p);
        }
    }
    for (var i=0;i<40;i++) {
        var k = Math.floor(Math.random()*Substances.length);
        Matrix[i%10][Math.floor(i/10)] = Substances[k];
        Substances = list_remove(Substances, k);
    }
    for (var i=0;i<2;i++) {
        for (var j=0;j<6;j++) {
            update_vial(i, j);
        }
    }
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
function list_copy(arr) {
    var arr0 = [0, 0, 0, 0];
    for (var i=0;i<4;i++) {
        arr0[i] = arr[i];
    }
    return arr0;
}

function vial_onclick(h, w) {
    if (current_vial[2]===false && first_index(Matrix[h*6+w]) != -1) {
        current_vial[2] = true;
        current_vial[0] = h;
        current_vial[1] = w;
        vial_border(1, h*6+w);
        move_up_vial(h*6+w, -1);
    }
    else if (current_vial[2]===true) {
        current_vial[2] = false;
        var arr0 = list_copy(Matrix[current_vial[0]*6+current_vial[1]]);
        var arr1 = list_copy(Matrix[h*6+w]);
        var a = first_index(arr0); 
        var b = first_index(arr1);
        if (b == -1 || b != -1 && arr0[a]==arr1[b] && b<3) {
            var n = Math.min(first_quantity(arr0), 3-b);
            for (var i=0;i<4;i++) {
                if (Matrix[h*6+w][i]==0 && n!=0) {
                    Matrix[h*6+w][i]=arr0[a]; n--; 
                }
            }
            n = Math.min(first_quantity(arr0), 3-b);
            for (var i=3;i>-1;i--) {
                if (Matrix[current_vial[0]*6+current_vial[1]][i]==arr0[a] && n!=0) {
                    Matrix[current_vial[0]*6+current_vial[1]][i]=0; n--;
                }
            }
        update_vial(current_vial[0], current_vial[1]);
        update_vial(h, w);
        }
        vial_border(0, null);
        saving_vials(0);
    }
    console.log(current_vial[2]);
}

for (let i=0;i<2;i++) {
    for (let j=0;j<6;j++) {
        var fiolqa = document.createElement("div");
        fiolqa.className = "fioleczka "+"fiolka"+i+"_"+j;
        fiolqa.style.top = (windowHeight*(i*0.35+0.2))+"px";
        fiolqa.style.left = (windowWidth*(j*0.08+0.28))+"px";
        fiolqa.addEventListener('click', function() { vial_onclick(i, j); }, false);
        document.body.appendChild(fiolqa);
    }
}


if (localStorage.getItem("czyZapisane")==null || localStorage.getItem("czyZapisane") == "f") {
    mix_vials();
    saving_vials(0);
    localStorage.setItem("czyZapisane", "t");
}
else {
    saving_vials(1);
    for (let i=0; i<2; i++) {
        for (let j=0; j<6; j++) {
            update_vial(i, j);
        }
    }
}
