defmodule TurtleTvWeb.CtrlChannel do
  use Phoenix.Channel

  intercept(["ctrl"])

  def join("ctrl", _message, socket) do
    {:ok, socket}
  end

  def join(_private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @spec handle_in(String.t(), map, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("ctrl", body, socket) when body === %{}, do: {:noreply, socket}

  def handle_in("ctrl", %{"body" => "poweroff"}, socket) do
    :os.cmd('sudo poweroff')
    {:noreply, socket}
  end

  def handle_in("ctrl", %{"body" => "reboot"}, socket) do
    :os.cmd('sudo reboot')
    {:noreply, socket}
  end
end
