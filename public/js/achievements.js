document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table')
  
    table.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-button')) {
        handleEdit(e.target)
      } else if (e.target.classList.contains('save-button')) {
        handleSave(e.target)
      } else if (e.target.classList.contains('cancel-button')) {
        handleCancel(e.target)
      } else if (e.target.classList.contains('delete-button')) {
        handleDelete(e.target)
      }
    })
  
    function handleEdit(button) {
      const row = button.closest('tr')
      const achievementID = row.dataset.id
  
      const titleCell = row.querySelector('[data-field="title"]')
      const pointsCell = row.querySelector('[data-field="pointsNeeded"]')
  
      const currentTitle = titleCell.textContent.trim()
      const currentPoints = pointsCell.textContent.trim()
  
      // Store original values in dataset attributes
      titleCell.dataset.original = currentTitle
      pointsCell.dataset.original = currentPoints
  
      // Replace content with editable inputs
      titleCell.innerHTML = `<input type="text" value="${currentTitle}" class="edit-title" required />`
      pointsCell.innerHTML = `<input type="number" value="${currentPoints}" class="edit-points" min="1" required />`
  
      const actionCell = row.querySelector('.action-buttons')
      actionCell.innerHTML = `
        <button type="button" class="save-button" data-id="${achievementID}">Save</button>
        <button type="button" class="cancel-button">Cancel</button>
      `
    }
  
    function handleSave(button) {
        const row = button.closest('tr')
        const achievementID = button.dataset.id
      
        const title = row.querySelector('.edit-title').value.trim()
        const pointsNeeded = row.querySelector('.edit-points').value.trim()
      
        if (!title || pointsNeeded <= 0) {
          alert('Title is required, and Points Needed must be greater than 0.')
          return
        }
      
        fetch(`/achievements/update/achievement=${achievementID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, pointsNeeded }),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to save changes.')
            return res.json()
          })
          .then((data) => {
            // Update the UI with new data
            const titleCell = row.querySelector('[data-field="title"]')
            const pointsCell = row.querySelector('[data-field="pointsNeeded"]')
      
            titleCell.textContent = data.title
            pointsCell.textContent = data.pointsNeeded 

            // Restore action buttons
            restoreActionButtons(row)
          })
          .catch((err) => alert(err.message))
    }
  
    function handleDelete(button) {
      const row = button.closest('tr') 
      const achievementID = button.dataset.id
  
      if (confirmDelete()) {
          fetch(`/achievements/delete/achievement=${achievementID}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then((res) => {
                  if (!res.ok) 
                      throw new Error('Failed to save changes.')
                  return res.json()
              })
              .then(() => {
                  row.remove() 
              })
              .catch((err) => alert(err.message))
      }
  }
  
    function handleCancel(button) {
      const row = button.closest('tr')
      const titleCell = row.querySelector('[data-field="title"]')
      const pointsCell = row.querySelector('[data-field="pointsNeeded"]')
  
      // Retrieve original values from dataset attributes
      const originalTitle = titleCell.dataset.original || titleCell.textContent.trim()
      const originalPoints = pointsCell.dataset.original || pointsCell.textContent.trim()
  
      // Reset cells to original values
      titleCell.textContent = originalTitle
      pointsCell.textContent = originalPoints
      restoreActionButtons(row)
    }
  
    function restoreActionButtons(row) {
      const actionCell = row.querySelector('.action-buttons')
  
      const achievementID = row.dataset.id
  
      // Restore action buttons
      actionCell.innerHTML = `
        <button type="button" class="edit-button">Edit</button>
        <button type="button" class="delete-button" data-id="${achievementID}">Delete</button>
      `
    }
  })
  
  function confirmDelete(form) {
    const confirmed = confirm('Are you sure you want to delete this achievement? This action cannot be undone.')
    return confirmed
  }