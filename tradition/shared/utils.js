const log = start => {
  console.log(
    `>>>>>>>>> 天呐！只花了 ${((performance.now() - start) / 1000).toFixed(
      2
    )}s 就拿到了姨的成绩。`
  );
};
