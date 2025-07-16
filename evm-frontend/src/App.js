import Pagination from "react-bootstrap/Pagination";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [valueMin, setValueMin] = useState(0);
  const [gasMin, setGasMin] = useState(0);
  const [gasMax, setGasMax] = useState(Infinity);
  const [chainFilter, setChainFilter] = useState("all");

  //Sorting Syntax

  const [sortKey, setSortKey] = useState(null); // e.g., 'value', 'gas'
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      // Toggle sort direction if same key clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New sort key → default to ascending
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (sortKey) {
    transactions.sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  //Applying Pagination
  const getPaginationItems = (currentPage, totalPages) => {
    const range = [];
    const delta = 2;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) range.push("start-ellipsis");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push("end-ellipsis");

    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  // Timestamp convertor to Human Readable Form
  function timeAgo(timestamp) {
    let txTime;

    if (!isNaN(timestamp)) {
      txTime = new Date(Number(timestamp) * 1000);
    } else {
      txTime = new Date(timestamp);
    }

    if (isNaN(txTime)) return "Invalid Date";

    const now = new Date();
    const diffMs = now - txTime;

    const diffMins = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMins / 1440);
    const hours = Math.floor((diffMins % 1440) / 60);
    const minutes = diffMins % 60;

    return `${days}d, ${hours}h, ${minutes}m ago`;
  }

  useEffect(() => {
    fetch(`/api/transactions?page=${currentPage}&limit=${rowsPerPage}`)
      .then((res) => res.json())
      .then((result) => {
        setTransactions(result.data || []);
        setTotalPages(result.totalPages || 1);
      })
      .catch((err) => console.error("Failed to fetch from server:", err));
  }, [currentPage, rowsPerPage]);

  return (
    <div className="bg-secondary bg-opacity-10 min-vh-100">
      <div className="container mt-5">
        <h1 className="mb-4 d-flex align-items-center justify-content-center gap-2 text-secondary">
          {/* <img src="/download.png" alt="Ethereum Logo" width="32" height="32" /> */}
          Ethereum Transactions
        </h1>

        {/* Seacrh Filter */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="🔍 Search by From or To Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Advanced Filter */}
        <div className="container my-4 p-3 border rounded bg-light">
          <h5 className="mb-3"> Advanced Filters</h5>

          <div className="row g-3">
            {/* Status Filter */}
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="success">Success (1)</option>
                <option value="fail">Fail (0)</option>
              </select>
            </div>
            {/* Value Range Slider */}
            <div className="col-md-3">
              <label className="form-label">Minimum Value (ETH)</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="10"
                step="0.01"
                value={valueMin}
                onChange={(e) => setValueMin(parseFloat(e.target.value))}
              />
              <div>{valueMin} ETH</div>
            </div>
            {/* Gas Min/Max */}
            <div className="col-md-3">
              <label className="form-label">Gas Used Range</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={gasMin}
                  onChange={(e) => setGasMin(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={gasMax === Infinity ? "" : gasMax}
                  onChange={(e) =>
                    setGasMax(
                      e.target.value === "" ? Infinity : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            {/* Chain Filter */}
            <div className="col-md-3">
              <label className="form-label">Blockchain</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="all"
                  checked={chainFilter === "all"}
                  onChange={(e) => setChainFilter(e.target.value)}
                />
                <label className="form-check-label">All</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="ETH"
                  checked={chainFilter === "ETH"}
                  onChange={(e) => setChainFilter(e.target.value)}
                />
                <label className="form-check-label">Ethereum</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="BSC"
                  checked={chainFilter === "BSC"}
                  onChange={(e) => setChainFilter(e.target.value)}
                />
                <label className="form-check-label">BSC</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Polygon"
                  checked={chainFilter === "Polygon"}
                  onChange={(e) => setChainFilter(e.target.value)}
                />
                <label className="form-check-label">Polygon</label>
              </div>
            </div>
          </div>
        </div>

        <Pagination className="d-flex justify-content-end mt-n1 mb-2 pe-3">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />

          {getPaginationItems(currentPage, totalPages).map((page, index) => {
            if (page === "start-ellipsis" || page === "end-ellipsis") {
              return <Pagination.Ellipsis key={index} disabled />;
            }

            return (
              <Pagination.Item
                key={index}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}

          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>

        <div className="table-responsive p-3">
          <table className="table table-hover custom-shadow bg-white rounded-3 text-center">
            <thead className="">
              <tr>
                <th>Sr No.</th>
                <th>Transaction Hash</th>
                <th
                  onClick={() => handleSort("block_number")}
                  style={{ cursor: "pointer" }}
                >
                  Block Number{" "}
                  {sortKey === "block_number" &&
                    (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th>Timestamp</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Gas Used</th>
                <th>Tx Index</th>
                <th>Txn Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td title={tx.hash}>
                    {tx.hash
                      ? `${tx.hash.slice(0, 5)}...${tx.hash.slice(-5)}`
                      : ""}
                    <button
                      className="btn btn-sm ms-1"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    >
                      <img src="/copy.png" alt="Copy" width="16" height="16" />
                    </button>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-25 text-primary fs-6">
                      {tx.block_number}
                    </span>
                  </td>
                  <td>{tx.block_timestamp}</td>
                  <td title={tx.from_address}>
                    {tx.from_address
                      ? `${tx.from_address.slice(
                          0,
                          5
                        )}...${tx.from_address.slice(-5)}`
                      : ""}
                    <button
                      className="btn btn-sm ms-1"
                      onClick={() =>
                        navigator.clipboard.writeText(tx.from_address)
                      }
                    >
                      <img src="/copy.png" alt="Copy" width="16" height="16" />
                    </button>
                  </td>
                  <td title={tx.to_address}>
                    {tx.to_address
                      ? `${tx.to_address.slice(0, 5)}...${tx.to_address.slice(
                          -5
                        )}`
                      : ""}
                    <button
                      className="btn btn-sm ms-1"
                      onClick={() =>
                        navigator.clipboard.writeText(tx.to_address)
                      }
                    >
                      <img src="/copy.png" alt="Copy" width="16" height="16" />
                    </button>
                  </td>
                  <td>{tx.value}</td>
                  <td>{tx.gas_used}</td>
                  <td>{tx.transaction_index}</td>
                  <td>{tx.status == 1 ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap"> */}
        {/* Row Selector */}

        {/* <div className="mb-2">
          <label className="me-2">Rows per page:</label>
          <select
            className="form-select d-inline w-auto"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div> */}

        {/* Bootstrap Pagination Component */}
      </div>
    </div>
  );
}

export default App;
