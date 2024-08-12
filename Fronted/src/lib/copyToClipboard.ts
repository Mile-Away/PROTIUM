const copyToClipboard = (token: string) => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        alert('Token copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy token: ', err);
      });
  };


export default copyToClipboard;