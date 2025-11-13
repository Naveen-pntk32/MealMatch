// Utility actions for MenuManagement

export async function handleUpdatePriceAction({ apiBaseUrl, cookId, monthlyPrice }) {
  const response = await fetch(`${apiBaseUrl}/addfood/price`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cookId, monthlyPrice: parseFloat(monthlyPrice) })
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(errText || 'Failed to update price');
  }
  return response.json();
}

export function updateMenuItemInState(menuItems, index, field, value) {
  const updatedItems = [...menuItems];
  updatedItems[index] = {
    ...updatedItems[index],
    [field]: value
  };
  return updatedItems;
}


