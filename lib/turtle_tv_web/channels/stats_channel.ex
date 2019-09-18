defmodule TurtleTvWeb.StatsChannel do
  use Phoenix.Channel

  intercept(["stats"])

  def join("stats", _message, socket) do
    {:ok, socket}
  end

  def join(_private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @spec handle_in(String.t(), map, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("stats", body, socket) when body === %{}, do: {:noreply, socket}

  def handle_in("stats", %{"body" => "hdd"}, socket) do
    {_, size, used} = :disksup.get_disk_data() |> Enum.find(&('/' === elem(&1, 0)))

    incmp_size =
      :os.cmd('du -s /home/turtletv/downloads/incomplete')
      |> to_string()
      |> String.split("\t")
      |> Enum.at(0)
      |> String.to_integer()
      |> Kernel.-(4)
      |> Kernel.*(1024)

    cpu_util = :cpu_sup.util()

    broadcast(socket, "hdd", %{
      size: size * 1024,
      used: used,
      incmp_size: incmp_size,
      cpu_util: cpu_util
    })

    {:noreply, socket}
  end

  def handle_in("stats", %{"body" => "del_incomp"}, socket) do
    :os.cmd('rm -rf /home/turtletv/downloads/incomplete/*')
    {:noreply, socket}
  end
end
