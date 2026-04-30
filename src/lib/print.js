export const imprimir = () => {
  const contenido = document.getElementById("ticket").innerHTML;

  const ventana = window.open("", "", "width=300,height=600");

  ventana.document.write(`
    <html>
      <head>
        <title>Ticket</title>
      </head>
      <body>
        ${contenido}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);

  ventana.document.close();
};