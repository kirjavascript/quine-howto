// const crc32 = (() => {
//   let n, table = (() => {
//     var i, j, results;
//     results = [];
//     for (n = i = 0; i <= 255; n = ++i) {
//       for (var j = 0; j <= 7; j++) {
//         if (n & 1) {
//           n = 0xEDB88320 ^ n >>> 1;
//         } else {
//           n >>>= 1;
//         }
//       }
//       results.push(n);
//     }
//     return results;
//   })();
// return (str, crc = -1) => {
//     var c, i, len;
//     for (i = 0, len = str.length; i < len; i++) {
//       c = str[i];
//       crc = crc >>> 8 ^ table[(crc ^ c.charCodeAt(0)) & 255];
//     }
//     return (crc ^ -1) >>> 0;
//   };
// })();

// for (t = R = n = o = []; o <= 255; n = ++o) {
//     for (t = 0; t <= 7; t++)
//         1 & n ? (n = 3988292384 ^ (n >>> 1)) : (n >>>= 1);
//     R[o]=n;
// }
// for (r = []+1151661577, t = -1, n, e = 0; e < r.length; e++)
//     (n = r[e]), (t = (t >>> 8) ^ R[255 & (t ^ n.charCodeAt(0))]);
// console.log(((-1 ^ t) >>> 0).toString(16));

// for(i=0n;;i++)if(crc32(`for(t=R=n=o=[];o<=255;n=++o){for(t=0;t<=7;t++)1&n?n=3988292384^n>>>1:n>>>=1;R[o]=n}for(r=[]+${i},t=-1,n,e=0;e<r.length;e++)n=r[e],t=t>>>8^R[255&(t^n.charCodeAt(0))];console.log(((-1^t)>>>0).toString(16))`)=== crc32(String(i)))console.log(i)

for(t=R=n=o=[];o<=255;n=++o){for(t=0;t<=7;t++)1&n?n=3988292384^n>>>1:n>>>=1;R[o]=n}for(r=[]+1190315716,t=-1,n,e=0;e<r.length;e++)n=r[e],t=t>>>8^R[255&(t^n.charCodeAt(0))];console.log(((-1^t)>>>0).toString(16))
