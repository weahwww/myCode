function formatArr(arr) {
        let a = [];
        for (let i in arr) {
                if (arr[i].status === 'enabled') {
                        a.push(arr[i]);
                }
        }
        let [c, d] = [
                [], a.length
        ];
        for (let i = 0; i < d; i += 3) {
                let k = a.slice(i, i + 3);
                if (k.length < 3) {
                        let l = [];
                        for (let i = 0; i < 3 - k.length; i++) {
                                l.push(0);
                        }
                        k = k.concat(l);
                }
                c.push(k);
        }
        return c;
}