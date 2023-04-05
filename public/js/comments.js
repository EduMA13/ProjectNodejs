
  const submitBtn = document.getElementById('submit-btn');
  const commentsList = document.getElementById('comments-list');

  // Obtener los comentarios guardados en el LocalStorage, si existen
  let comments = JSON.parse(localStorage.getItem('comments')) || [];

  // Renderizar los comentarios existentes
  renderComments();

  // Agregar evento de clic al botón para subir comentario
  submitBtn.addEventListener('click', () => {
    // Obtener el valor del nombre y el comentario
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    const name = nameInput.value;
    const comment = commentInput.value;

    // Si no se ingresó un nombre o un comentario, no se hace nada
    if (!name || !comment) {
      return;
    }

    // Crear un objeto con el nombre y el comentario
    const newComment = { name, comment };

    // Agregar el nuevo comentario a la matriz de comentarios
    comments.push(newComment);

    // Guardar los comentarios en el LocalStorage
    localStorage.setItem('comments', JSON.stringify(comments));

    // Renderizar los comentarios
    renderComments();

    // Limpiar el formulario
    nameInput.value = '';
    commentInput.value = '';
  });

  // Función para renderizar los comentarios
function renderComments() {
    // Limpiar la lista de comentarios existentes
    commentsList.innerHTML = '';
    // Renderizar cada comentario en un elemento de lista
    comments.forEach(comment => {
      const li = document.createElement('li');
      li.classList.add('mb-2');
      li.innerHTML = `<span class="font-bold">${comment.name}:</span> ${comment.comment}`;
      commentsList.appendChild(li);
    });
  }