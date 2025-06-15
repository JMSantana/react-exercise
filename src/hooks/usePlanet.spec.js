import { renderHook, act, waitFor } from "@testing-library/react";
import { test, expect, describe, beforeEach, jest } from "@jest/globals";
import usePlanet from "./usePlanet";

global.fetch = jest.fn();

describe("usePlanet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePlanet());

    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it("should fetch planets data successfully", async () => {
    const mockData = {
      results: [{ name: "Tatooine" }],
      next: "http://swapi.dev/api/planets/?page=2",
      previous: null,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => usePlanet());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => usePlanet());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });

  it("should handle next page navigation", async () => {
    const mockData1 = {
      results: [{ name: "Tatooine" }],
      next: "http://swapi.dev/api/planets/?page=2",
      previous: null,
    };

    const mockData2 = {
      results: [{ name: "Hoth" }],
      next: null,
      previous: "http://swapi.dev/api/planets/?page=1",
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

    const { result } = renderHook(() => usePlanet());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.next();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(mockData2);
  });

  it("should handle failed response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => usePlanet());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch planets");
    expect(result.current.data).toBeNull();
  });

  it("should call refresh function", async () => {
    const mockData = {
      results: [{ name: "Tatooine" }],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => usePlanet());

    await act(async () => {
      result.current.refresh();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(mockData);
  });
});

it("should fetch planets data successfully", async () => {
  const mockData = {
    results: [{ name: "Tatooine" }],
    next: "http://swapi.dev/api/planets/?page=2",
    previous: null,
  };

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData,
  });

  const { result } = renderHook(() => usePlanet());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
});

it("should handle fetch error", async () => {
  global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

  const { result } = renderHook(() => usePlanet());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });
});

it("should handle next page navigation", async () => {
  const mockData1 = {
    results: [{ name: "Tatooine" }],
    next: "http://swapi.dev/api/planets/?page=2",
    previous: null,
  };

  const mockData2 = {
    results: [{ name: "Hoth" }],
    next: null,
    previous: "http://swapi.dev/api/planets/?page=1",
  };

  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockData1,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockData2,
    });

  const { result } = renderHook(() => usePlanet());

  act(() => {
    result.current.next();
  });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockData2);
  });
});

it("should handle previous page navigation", async () => {
  const mockData1 = {
    results: [{ name: "Tatooine" }],
    next: "http://swapi.dev/api/planets/?page=2",
    previous: null,
  };

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData1,
  });

  const { result } = renderHook(() => usePlanet());

  act(() => {
    result.current.previous();
  });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
