methods: {
    fetchUsers() {
      // 这里需要调用后端接口获取用户信息列表
      console.log('Fetching users with filters:', this.searchForm);
      // 假设后端接口返回的数据格式为 { users: [...], total: ... }
      const response = {
        users: [
          { id: 1, username: 'john_doe', status: 'active' },
          { id: 2, username: 'jane_smith', status: 'inactive' },
          { id: 3, username: 'alice_jones', status: 'active' },
          { id: 4, username: 'bob_brown', status: 'inactive' },
          { id: 5, username: 'charlie_black', status: 'active' }
          // 其他用户信息
        ],
        total: 5
      };
      this.users = response.users;
      this.pagination.total = response.total;
    },