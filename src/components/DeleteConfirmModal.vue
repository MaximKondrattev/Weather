<template>
  <div
    v-if="show"
    class="modal"
  >
    <p>Are you sure you want to delete the block?</p>
    <div class="modal-buttons">
      <button
        class="modal-delete"
        @click="$emit('confirm')"
      >
        Yes
      </button>
      <button
        class="modal-cancel"
        @click="$emit('close')"
      >
        No
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeleteConfirmModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["confirm", "close"],
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  text-align: center;
  min-width: 320px;
  z-index: 1001;
  animation: modalAppear 0.3s ease;
}

.modal::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  animation: overlayAppear 0.3s ease;
}

.modal p {
  margin: 0 0 20px;
  font-size: 1.1rem;
  color: #343a40;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal button {
  padding: 8px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-delete {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

.modal-cancel {
  background-color: #6c757d;
  color: white;
  box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2);
}

.modal button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
@keyframes overlayAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
